import { Injectable } from '@nestjs/common';
import { ProductPriceIndexService } from './product-price-index.service';
import { ProductEntity } from '../entities/product.entity';

/**
 * ProductInitializerService
 *
 * Responsible for initializing test product data when the application starts.
 * This service creates sample products during module initialization to provide
 * data for testing and demonstration purposes.
 *
 * Usage:
 * - Inject this service in ProductModule
 * - Call initializeTestData() in ProductModule.onModuleInit()
 */
@Injectable()
export class ProductInitializerService {
  /**
   * Test product data
   * Contains sample products with various prices and categories
   * Used to populate the system with initial data
   */
  private readonly testProducts = [
    {
      id: 'laptop-001',
      name: 'Gaming Laptop',
      price: 1299.99,
      quantity: 5,
      category: 'Electronics',
    },
    {
      id: 'mouse-001',
      name: 'Wireless Mouse',
      price: 29.99,
      quantity: 100,
      category: 'Accessories',
    },
    {
      id: 'monitor-001',
      name: '4K Monitor',
      price: 599.99,
      quantity: 10,
      category: 'Electronics',
    },
    {
      id: 'keyboard-001',
      name: 'Mechanical Keyboard',
      price: 149.99,
      quantity: 50,
      category: 'Accessories',
    },
    {
      id: 'cable-001',
      name: 'USB-C Cable',
      price: 19.99,
      quantity: 500,
      category: 'Accessories',
    },
    {
      id: 'headphones-001',
      name: 'Wireless Headphones',
      price: 199.99,
      quantity: 30,
      category: 'Accessories',
    },
    {
      id: 'iphone-001',
      name: 'iPhone 15 Pro',
      price: 1099.99,
      quantity: 20,
      category: 'Electronics',
    },
    {
      id: 'charger-001',
      name: 'Fast Charger',
      price: 39.99,
      quantity: 200,
      category: 'Accessories',
    },
  ];

  constructor(private priceIndexService: ProductPriceIndexService) {}

  /**
   * Initialize test product data
   *
   * Process:
   * 1. Iterate through test product data
   * 2. Create ProductEntity instance for each product
   * 3. Add product to the price index via ProductPriceIndexService
   * 4. Log success message for each product
   * 5. Display initialization statistics
   *
   * @throws Error if ProductEntity creation fails
   */
  initializeTestData(): void {
    console.log('\n📊 Initializing product data...\n');

    // Iterate through test products
    this.testProducts.forEach((productData) => {
      try {
        // Create product entity from raw data
        const product = new ProductEntity(productData);

        // Add product to the price index
        this.priceIndexService.addProduct(product);

        // Log success message
        console.log(`✅ ${product.name} - $${product.price}`);
      } catch (error) {
        // If product already exists, log warning
        console.warn(`⚠️  Product ${productData.id} already exists, skipping`);
      }
    });

    // Display initialization statistics
    this.displayStatistics();
  }

  /**
   * Display statistics after initialization
   * Shows total product count, price range, average price, and total value
   *
   * @private
   */
  private displayStatistics(): void {
    try {
      // Get statistics from the price index service
      const stats = this.priceIndexService.getStatistics();

      // Log statistics in a formatted way
      console.log('\n📊 Initialization Statistics:');
      console.log(`   ├─ Product Count: ${stats.totalProducts}`);
      console.log(
        `   ├─ Price Range: $${stats.priceRange.min} - $${stats.priceRange.max}`,
      );
      console.log(`   ├─ Average Price: $${stats.averagePrice.toFixed(2)}`);
      console.log(`   └─ Total Value: $${stats.totalValue.toFixed(2)}`);
      console.log('\n✅ Application is ready!\n');
    } catch (error) {
      // Handle any errors that occur when getting statistics
      console.error('❌ Failed to retrieve statistics:', error);
    }
  }

  /**
   * Check if data has already been initialized
   * Prevents duplicate initialization when the module is reloaded
   *
   * @returns {boolean} true if products have been initialized, false otherwise
   */
  isInitialized(): boolean {
    return this.priceIndexService.getProductCount() > 0;
  }

  /**
   * Get the number of test products defined in this service
   *
   * @returns {number} The total count of test products
   */
  getTestProductCount(): number {
    return this.testProducts.length;
  }
}
