import { IsString, IsNumber, IsInt, Min, IsOptional } from 'class-validator';

/**
 * Update Product Data Transfer Object
 * Used for validating and transferring product update data
 * All fields are optional to support partial updates
 */
export class UpdateProductDto {
  /**
   * Product name/title (optional)
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * Product price in dollars (optional)
   * Must be non-negative if provided
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  /**
   * Available quantity in stock (optional)
   * Must be a non-negative integer if provided
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  /**
   * Product category/type (optional)
   */
  @IsOptional()
  @IsString()
  category?: string;
}
