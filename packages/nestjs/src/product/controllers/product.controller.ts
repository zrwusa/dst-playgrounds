import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from '../product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductQueryDto, ApplyDiscountDto } from '../dto/product-query.dto';
import type { ApiResponse } from 'src/common/types/api-response';

/**
 * Product API Controller
 * Handles all REST API endpoints for product management
 */
@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Create a new product
   * POST /api/products
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto): ApiResponse {
    try {
      const data = this.productService.create(createProductDto);
      return {
        success: true,
        message: 'Product created successfully',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all products with optional filtering
   * GET /api/products
   */
  @Get()
  findAll(@Query() query: ProductQueryDto): ApiResponse {
    const data =
      Object.keys(query).length > 0
        ? this.productService.search(query)
        : this.productService.findAll();
    return {
      success: true,
      message: 'Products retrieved successfully',
      data,
    };
  }

  /**
   * Get total product count
   * GET /api/products/count
   */
  @Get('count')
  getCount(): ApiResponse {
    const data = { count: this.productService.count() };
    return {
      success: true,
      message: 'Count retrieved successfully',
      data,
    };
  }

  /**
   * Get inventory statistics
   * GET /api/products/stats/summary
   */
  @Get('stats/summary')
  getStatistics(): ApiResponse {
    const data = this.productService.getStatistics();
    return {
      success: true,
      message: 'Statistics retrieved successfully',
      data,
    };
  }

  /**
   * Paginate products by price (rank-based, O(log n + pageSize))
   * GET /api/products/page?page=0&pageSize=10
   */
  @Get('page')
  getByPage(
    @Query('page') page: string = '0',
    @Query('pageSize') pageSize: string = '10',
  ): ApiResponse {
    const pageNum = parseInt(page, 10);
    const sizeNum = parseInt(pageSize, 10);
    if (isNaN(pageNum) || pageNum < 0)
      throw new BadRequestException('Invalid page number');
    if (isNaN(sizeNum) || sizeNum < 1 || sizeNum > 100)
      throw new BadRequestException('pageSize must be between 1 and 100');

    const data = this.productService.getByPage(pageNum, sizeNum);
    return {
      success: true,
      message: `Page ${pageNum} retrieved (${data.length} items)`,
      data,
    };
  }

  /**
   * Get top N cheapest products
   * GET /api/products/cheapest/:n
   */
  @Get('cheapest/:n')
  getTopNCheapest(@Param('n') n: string): ApiResponse {
    const num = parseInt(n, 10);
    if (isNaN(num) || num < 1) throw new BadRequestException('Invalid count');

    const data = this.productService.getTopNCheapest(num);
    return {
      success: true,
      message: `Top ${num} cheapest products`,
      data,
    };
  }

  /**
   * Get top N most expensive products
   * GET /api/products/expensive/:n
   */
  @Get('expensive/:n')
  getTopNExpensive(@Param('n') n: string): ApiResponse {
    const num = parseInt(n, 10);
    if (isNaN(num) || num < 1) throw new BadRequestException('Invalid count');

    const data = this.productService.getTopNExpensive(num);
    return {
      success: true,
      message: `Top ${num} most expensive products`,
      data,
    };
  }

  /**
   * Get price percentile for a product
   * GET /api/products/:id/percentile
   */
  @Get(':id/percentile')
  getPercentile(@Param('id') id: string): ApiResponse {
    const percentile = this.productService.getPercentile(id);
    const tier = this.productService.getTierByPercentile(id);
    return {
      success: true,
      message: 'Percentile retrieved',
      data: { productId: id, percentile: +percentile.toFixed(1), tier },
    };
  }

  /**
   * Get median-priced product
   * GET /api/products/stats/median
   */
  @Get('stats/median')
  getMedian(): ApiResponse {
    const data = this.productService.getMedianProduct();
    return {
      success: true,
      message: 'Median product retrieved',
      data,
    };
  }

  /**
   * Get a single product by ID
   * GET /api/products/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string): ApiResponse {
    const data = this.productService.findOne(id);
    return {
      success: true,
      message: 'Product retrieved successfully',
      data,
    };
  }

  /**
   * Update a product
   * PUT /api/products/:id
   */
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): ApiResponse {
    const data = this.productService.update(id, updateProductDto);
    return {
      success: true,
      message: 'Product updated successfully',
      data,
    };
  }

  /**
   * Delete a product
   * DELETE /api/products/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    this.productService.delete(id);
  }

  /**
   * Apply discount to products within price range
   * POST /api/products/discount/apply
   */
  @Post('discount/apply')
  applyDiscount(@Body() applyDiscountDto: ApplyDiscountDto): ApiResponse {
    if (applyDiscountDto.minPrice > applyDiscountDto.maxPrice) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }
    if (
      applyDiscountDto.discountPercent > 100 ||
      applyDiscountDto.discountPercent < 0
    ) {
      throw new BadRequestException(
        'discountPercent must be between 0 and 100',
      );
    }

    const data = this.productService.applyDiscount(
      applyDiscountDto.minPrice,
      applyDiscountDto.maxPrice,
      applyDiscountDto.discountPercent,
    );

    return {
      success: true,
      message: `Discount applied to ${data.length} product(s)`,
      data,
    };
  }

  /**
   * Find highest-priced product within budget
   * GET /api/products/budget/:budget
   */
  @Get('budget/:budget')
  findMaxPriceWithinBudget(@Param('budget') budget: string): ApiResponse {
    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum < 0) {
      throw new BadRequestException('Invalid budget value');
    }

    const data = this.productService.findMaxPriceWithinBudget(budgetNum);
    return {
      success: true,
      message: 'Product retrieved successfully',
      data,
    };
  }

  /**
   * Find cheapest product above minimum price
   * GET /api/products/above-price/:minPrice
   */
  @Get('above-price/:minPrice')
  findMinPriceAbovePrice(@Param('minPrice') minPrice: string): ApiResponse {
    const minPriceNum = parseFloat(minPrice);
    if (isNaN(minPriceNum) || minPriceNum < 0) {
      throw new BadRequestException('Invalid minPrice value');
    }

    const data = this.productService.findMinPriceAbovePrice(minPriceNum);
    return {
      success: true,
      message: 'Product retrieved successfully',
      data,
    };
  }
}
