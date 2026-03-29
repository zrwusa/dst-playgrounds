import { IsNumber, IsString, IsOptional, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Product Query Data Transfer Object
 * Used for validating and transferring product search/filter queries
 * All fields are optional to support flexible searching
 */
export class ProductQueryDto {
  /**
   * Minimum price for range query (optional)
   * Must be non-negative if provided
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  /**
   * Maximum price for range query (optional)
   * Must be non-negative if provided
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  /**
   * Product category filter (optional)
   * Case-insensitive matching
   */
  @IsOptional()
  @IsString()
  category?: string;

  /**
   * Product tier filter (optional)
   * Valid values: budget ($0-$50), mid-range ($50-$200), premium ($200+)
   */
  @IsOptional()
  @IsEnum(['budget', 'mid-range', 'premium'])
  tier?: 'budget' | 'mid-range' | 'premium';
}

/**
 * Apply Discount Data Transfer Object
 * Used for validating and transferring discount application data
 */
export class ApplyDiscountDto {
  /**
   * Minimum price of products to apply discount to
   * Must be non-negative
   */
  @IsNumber()
  @Min(0)
  minPrice: number;

  /**
   * Maximum price of products to apply discount to
   * Must be non-negative
   */
  @IsNumber()
  @Min(0)
  maxPrice: number;

  /**
   * Discount percentage to apply
   * Must be between 0 and 100
   */
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discountPercent: number;
}
