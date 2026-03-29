import { Injectable } from '@nestjs/common';
import { ProductPriceIndexService } from './services/product-price-index.service';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import type { TierName } from './services/product-price-index.service';

/**
 * Product Service - Facade Layer
 * Responsible for business logic and interaction with Controller
 * Uses ProductPriceIndexService as the underlying data storage
 */
@Injectable()
export class ProductService {
  constructor(private readonly priceIndexService: ProductPriceIndexService) {}

  /**
   * Create a new product
   */
  create(createProductDto: CreateProductDto): ProductEntity {
    const product = new ProductEntity({
      ...createProductDto,
      lastUpdated: new Date(),
    });
    return this.priceIndexService.addProduct(product);
  }

  /**
   * Get all products sorted by price
   * Time Complexity: O(n)
   */
  findAll(): ProductEntity[] {
    return this.priceIndexService.getAllProductsSortedByPrice();
  }

  /**
   * Search products with optional filters
   */
  search(query: ProductQueryDto): ProductEntity[] {
    if (query.tier) {
      let products = this.priceIndexService.getProductsByTier(query.tier);
      if (query.category) {
        products = products.filter(
          (p) => p.category.toLowerCase() === query.category!.toLowerCase(),
        );
      }
      return products;
    }

    if (query.minPrice !== undefined && query.maxPrice !== undefined) {
      if (query.category) {
        return this.priceIndexService.getProductsByPriceAndCategory(
          query.minPrice,
          query.maxPrice,
          query.category,
        );
      }
      return this.priceIndexService.getProductsByPriceRange(
        query.minPrice,
        query.maxPrice,
      );
    }

    return this.findAll();
  }

  /**
   * Get a single product by ID
   * Time Complexity: O(1)
   */
  findOne(id: string): ProductEntity {
    return this.priceIndexService.getProductById(id);
  }

  /**
   * Update a product
   * Time Complexity: O(log n)
   */
  update(id: string, updateProductDto: UpdateProductDto): ProductEntity {
    return this.priceIndexService.updateProduct(id, updateProductDto);
  }

  /**
   * Delete a product
   * Time Complexity: O(log n)
   */
  delete(id: string): void {
    this.priceIndexService.deleteProduct(id);
  }

  /**
   * Apply discount to products within price range
   * Time Complexity: O((log n + k) * log n)
   */
  applyDiscount(
    minPrice: number,
    maxPrice: number,
    discountPercent: number,
  ): ProductEntity[] {
    return this.priceIndexService.applyDiscountToRange(
      minPrice,
      maxPrice,
      discountPercent,
    );
  }

  /**
   * Get inventory statistics
   * Time Complexity: O(n)
   */
  getStatistics() {
    return this.priceIndexService.getStatistics();
  }

  /**
   * Find the highest-priced product within budget
   * Time Complexity: O(log n) — uses floor()
   */
  findMaxPriceWithinBudget(budget: number): ProductEntity | null {
    return this.priceIndexService.getHighestPricedProductWithinBudget(budget);
  }

  /**
   * Find the cheapest product above minimum price
   * Time Complexity: O(log n) — uses higher()
   */
  findMinPriceAbovePrice(minPrice: number): ProductEntity | null {
    return this.priceIndexService.getCheapestProductAbovePrice(minPrice);
  }

  /**
   * Check if a product exists
   * Time Complexity: O(1)
   */
  exists(id: string): boolean {
    return this.priceIndexService.hasProduct(id);
  }

  /**
   * Get total product count
   * Time Complexity: O(1)
   */
  count(): number {
    return this.priceIndexService.getProductCount();
  }

  // ── Order-Statistic API (rank-based) ──────────────────────

  /**
   * Paginate products by price rank
   * Time Complexity: O(log n + pageSize)
   */
  getByPage(page: number, pageSize: number): ProductEntity[] {
    return this.priceIndexService.getProductsByPage(page, pageSize);
  }

  /**
   * Get price percentile of a product
   * Time Complexity: O(log n)
   */
  getPercentile(productId: string): number {
    return this.priceIndexService.getPricePercentile(productId);
  }

  /**
   * Get dynamic tier based on percentile
   * Time Complexity: O(log n)
   */
  getTierByPercentile(productId: string): TierName {
    return this.priceIndexService.getTierByPercentile(productId);
  }

  /**
   * Get median-priced product
   * Time Complexity: O(log n)
   */
  getMedianProduct(): ProductEntity | null {
    return this.priceIndexService.getMedianProduct();
  }

  /**
   * Get top N cheapest products
   * Time Complexity: O(log n + k)
   */
  getTopNCheapest(n: number): ProductEntity[] {
    return this.priceIndexService.getTopNCheapest(n);
  }

  /**
   * Get top N most expensive products
   * Time Complexity: O(log n + k)
   */
  getTopNExpensive(n: number): ProductEntity[] {
    return this.priceIndexService.getTopNExpensive(n);
  }
}
