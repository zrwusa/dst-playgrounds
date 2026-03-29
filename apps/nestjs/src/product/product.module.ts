import { Module, OnModuleInit } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './controllers/product.controller';
import { ProductPriceIndexService } from './services/product-price-index.service';
import { ProductInitializerService } from './services/product-initializer.service';

/**
 * Product Module
 * Encapsulates all product-related functionality
 * Includes controllers, services, and price indexing logic
 */
@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductPriceIndexService,
    ProductInitializerService,
  ],
  exports: [ProductService, ProductPriceIndexService],
})
export class ProductModule implements OnModuleInit {
  constructor(private initializerService: ProductInitializerService) {}

  onModuleInit() {
    if (!this.initializerService.isInitialized()) {
      this.initializerService.initializeTestData();
    }
  }
}
