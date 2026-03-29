import { IsString, IsNumber, IsInt, Min, IsNotEmpty } from 'class-validator';

/**
 * Create Product Data Transfer Object
 * Used for validating and transferring product creation data
 * All fields are required for product creation
 */
export class CreateProductDto {
  /**
   * Unique product identifier
   */
  @IsNotEmpty()
  @IsString()
  id: string;

  /**
   * Product name/title
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * Product price in dollars
   * Must be non-negative
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  /**
   * Available quantity in stock
   * Must be a non-negative integer
   */
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  quantity: number;

  /**
   * Product category/type
   */
  @IsNotEmpty()
  @IsString()
  category: string;
}