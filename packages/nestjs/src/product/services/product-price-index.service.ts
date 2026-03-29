import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Range, RedBlackTree } from 'data-structure-typed';
import { ProductEntity as Product } from '../entities/product.entity';

/** KEY INSIGHT: Use compound keys to solve the problem of "multiple products at the same price" */
interface CompositeKey {
  price: number;
  productId: string;
}

export type TierName = 'budget' | 'mid-range' | 'premium';

/**
 * Product Price Index Service using Red-Black Tree with Composite Keys
 *
 * ⭐ Performance vs Alternatives:
 *
 * Operation          | RBTree(this approach) | Array     | HashMap + Sort
 * -------------------|-----------------------|-----------|---------------
 * Range Query        | O(log n + k)          | O(n)      | O(k log k)
 * Point Lookup       | O(1)                  | O(1)      | O(1)
 * Insert/Update      | O(log n)              | O(n)      | O(log n)
 * Sort by Price      | O(n)                  | O(n log n)| O(n log n)
 * Pagination         | O(log n + k)          | O(n log n)| O(n log n)
 * Rank/Percentile    | O(log n)              | O(n)      | O(n log n)
 * Multiple at Price  | ✓ Supported           | ✓         | Complex
 *
 * Advantages:
 * - O(1) idToKeyMap lookup + O(log n) tree operations
 * - Automatic ordering without post-sort
 * - Efficient range queries for pricing tiers
 * - O(log n) rank-based pagination and percentile queries
 * - Low memory footprint vs duplicate maps
 */
@Injectable()
export class ProductPriceIndexService {
  private priceIndex: RedBlackTree<CompositeKey, Product>;
  private idToKeyMap: Map<string, CompositeKey>;

  constructor() {
    this.priceIndex = new RedBlackTree([], {
      comparator: (a: CompositeKey, b: CompositeKey) => {
        const priceCmp = a.price - b.price;
        if (priceCmp !== 0) return priceCmp;
        return a.productId.localeCompare(b.productId);
      },
      enableOrderStatistic: true,
    });
    this.idToKeyMap = new Map();
  }

  /** Time Complexity: O(log n) */
  addProduct(product: Product): Product {
    if (this.idToKeyMap.has(product.id))
      throw new BadRequestException(`Product ${product.id} already exists`);

    product.lastUpdated = new Date();

    const key: CompositeKey = {
      price: product.price,
      productId: product.id,
    };

    this.priceIndex.set(key, product);
    this.idToKeyMap.set(product.id, key);

    return product;
  }

  /** Time Complexity: O(log n) */
  updateProduct(productId: string, updates: Partial<Product>): Product {
    const oldKey = this.idToKeyMap.get(productId);
    if (oldKey === undefined)
      throw new NotFoundException(`Product ${productId} not found`);

    const existing = this.priceIndex.get(oldKey);
    if (!existing)
      throw new NotFoundException(`Product ${productId} not found`);

    const updated: Product = {
      ...existing,
      ...updates,
      id: existing.id,
      lastUpdated: new Date(),
    };

    const newPrice = updates.price ?? existing.price;

    this.priceIndex.delete(oldKey);
    const currentKey: CompositeKey = {
      price: newPrice,
      productId,
    };
    this.priceIndex.set(currentKey, updated);
    this.idToKeyMap.set(productId, currentKey);

    return updated;
  }

  /** Time Complexity: O(1) */
  getProductById(productId: string): Product {
    const key = this.idToKeyMap.get(productId);

    if (key === undefined)
      throw new NotFoundException(`Product ${productId} not found`);

    return this.priceIndex.get(key)!;
  }

  /** Time Complexity: O(log n + k) — directly returns values, no secondary lookup */
  getProductsByPriceRange(minPrice: number, maxPrice: number): Product[] {
    const range = new Range(
      { price: minPrice, productId: '' },
      { price: maxPrice, productId: '\uffff' },
      true, // includeLow
      true, // includeHigh
    );

    return this.priceIndex.rangeSearch(range, (n) => n.value!);
  }

  /** Time Complexity: O(log n) */
  getHighestPricedProductWithinBudget(maxBudget: number): Product | null {
    const key: CompositeKey = {
      price: maxBudget,
      productId: '\uffff',
    };
    const floorKey = this.priceIndex.floor(key);
    return floorKey ? this.priceIndex.get(floorKey)! : null;
  }

  /** Time O(log n) */
  getCheapestProductAbovePrice(minPrice: number): Product | null {
    const key: CompositeKey = {
      price: minPrice,
      productId: '\uffff',
    };
    const higherKey = this.priceIndex.higher(key);
    return higherKey ? this.priceIndex.get(higherKey)! : null;
  }

  /** Time Complexity: O(log n + k) */
  getProductsByTier(tierName: TierName): Product[] {
    const tiers = {
      budget: [0, 50],
      'mid-range': [50, 200],
      premium: [200, Infinity],
    };

    const [min, max] = tiers[tierName];
    return this.getProductsByPriceRange(min, max);
  }

  /** Time Complexity: O(log n + k + m) */
  getProductsByPriceAndCategory(
    minPrice: number,
    maxPrice: number,
    category: string,
  ): Product[] {
    const priceRangeProducts = this.getProductsByPriceRange(minPrice, maxPrice);
    return priceRangeProducts.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  }

  /** Time Complexity: O((log n + k) * log n) */
  applyDiscountToRange(
    minPrice: number,
    maxPrice: number,
    discountPercent: number,
  ): Product[] {
    const products = this.getProductsByPriceRange(minPrice, maxPrice);
    const updated: Product[] = [];

    for (const product of products) {
      const newPrice = product.price * (1 - discountPercent / 100);
      const updatedProduct = this.updateProduct(product.id, {
        price: newPrice,
      });
      updated.push(updatedProduct);
    }

    return updated;
  }

  /** Time Complexity: O(log n) */
  deleteProduct(productId: string): void {
    const key = this.idToKeyMap.get(productId);

    if (key === undefined)
      throw new NotFoundException(`Product ${productId} not found`);

    this.priceIndex.delete(key);
    this.idToKeyMap.delete(productId);
  }

  /**
   * Get inventory statistics
   * Time Complexity: O(n) for totalValue, O(log n) for min/max
   */
  getStatistics(): {
    totalProducts: number;
    priceRange: { min: number; max: number };
    averagePrice: number;
    totalValue: number;
  } {
    if (this.idToKeyMap.size === 0) {
      return {
        totalProducts: 0,
        priceRange: { min: 0, max: 0 },
        averagePrice: 0,
        totalValue: 0,
      };
    }

    // O(log n) — tree is already sorted, just grab endpoints
    const minKey = this.priceIndex.getLeftMost();
    const maxKey = this.priceIndex.getRightMost();
    const minPrice = minKey ? minKey.price : 0;
    const maxPrice = maxKey ? maxKey.price : 0;

    // O(n) — still need to sum values
    let totalValue = 0;
    let totalProducts = 0;

    for (const [, product] of this.priceIndex) {
      totalValue += product.price * product.quantity;
      totalProducts += product.quantity;
    }

    return {
      totalProducts,
      priceRange: { min: minPrice, max: maxPrice },
      averagePrice: totalValue / totalProducts,
      totalValue,
    };
  }

  /**
   * Get all products sorted by price — iterator protocol, one-liner
   * Time Complexity: O(n)
   */
  getAllProductsSortedByPrice(): Product[] {
    return [...this.priceIndex.values()];
  }

  // ── Order-Statistic API (rank-based queries) ──────────────────────

  /**
   * Paginate products by price rank
   * Time Complexity: O(log n + pageSize)
   * @param page - 0-indexed page number
   * @param pageSize - Number of items per page
   * @returns Products for the requested page, sorted by price
   */
  getProductsByPage(page: number, pageSize: number): Product[] {
    const start = page * pageSize;
    const end = Math.min(start + pageSize - 1, this.priceIndex.size - 1);
    if (start >= this.priceIndex.size) return [];
    const keys = this.priceIndex.rangeByRank(start, end);
    return keys.map((key) => this.priceIndex.get(key)!);
  }

  /**
   * Get the price percentile of a product
   * Time Complexity: O(log n)
   * @param productId - Product ID
   * @returns Percentile (0-100) indicating what % of products are cheaper
   */
  getPricePercentile(productId: string): number {
    const key = this.idToKeyMap.get(productId);
    if (!key) throw new NotFoundException(`Product ${productId} not found`);
    const rank = this.priceIndex.getRank(key);
    return (rank / this.priceIndex.size) * 100;
  }

  /**
   * Get the cheapest product — O(log n) via rank
   */
  getCheapestProduct(): Product | null {
    const key = this.priceIndex.getByRank(0);
    return key ? this.priceIndex.get(key)! : null;
  }

  /**
   * Get the most expensive product — O(log n) via rank
   */
  getMostExpensiveProduct(): Product | null {
    const key = this.priceIndex.getByRank(this.priceIndex.size - 1);
    return key ? this.priceIndex.get(key)! : null;
  }

  /**
   * Get the median-priced product — O(log n)
   */
  getMedianProduct(): Product | null {
    if (this.priceIndex.size === 0) return null;
    const medianRank = Math.floor((this.priceIndex.size - 1) / 2);
    const key = this.priceIndex.getByRank(medianRank);
    return key ? this.priceIndex.get(key)! : null;
  }

  /**
   * Dynamic tier by percentile — no hardcoded price ranges
   * Time Complexity: O(log n)
   * @param productId - Product ID
   * @returns Tier based on percentile position
   */
  getTierByPercentile(productId: string): TierName {
    const pct = this.getPricePercentile(productId);
    if (pct < 33) return 'budget';
    if (pct < 66) return 'mid-range';
    return 'premium';
  }

  /**
   * Get top N cheapest products — O(log n + k)
   * @param n - Number of products to return
   */
  getTopNCheapest(n: number): Product[] {
    const end = Math.min(n - 1, this.priceIndex.size - 1);
    if (end < 0) return [];
    const keys = this.priceIndex.rangeByRank(0, end);
    return keys.map((key) => this.priceIndex.get(key)!);
  }

  /**
   * Get top N most expensive products — O(log n + k)
   * @param n - Number of products to return
   */
  getTopNExpensive(n: number): Product[] {
    const size = this.priceIndex.size;
    if (size === 0) return [];
    const start = Math.max(size - n, 0);
    const keys = this.priceIndex.rangeByRank(start, size - 1);
    return keys.map((key) => this.priceIndex.get(key)!).reverse();
  }

  /** O(1) */
  getProductCount(): number {
    return this.idToKeyMap.size;
  }

  /** O(1) */
  hasProduct(productId: string): boolean {
    return this.idToKeyMap.has(productId);
  }

  /** O(n) */
  getAllProductIds(): string[] {
    return [...this.idToKeyMap.keys()];
  }
}
