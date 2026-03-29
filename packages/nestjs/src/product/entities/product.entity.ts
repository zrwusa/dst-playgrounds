/**
 * Product Entity Class
 * Represents a product in the inventory with strong typing
 */
export class ProductEntity {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  lastUpdated?: Date;

  /**
   * Constructor to create a ProductEntity from partial data
   * Ensures all required fields are properly initialized
   * @param partial - Partial product data
   */
  constructor(partial: Partial<ProductEntity>) {
    this.id = partial.id || '';
    this.name = partial.name || '';
    this.price = partial.price ?? 0;
    this.quantity = partial.quantity ?? 0;
    this.category = partial.category || '';
    this.lastUpdated = partial.lastUpdated || new Date();
  }

  /**
   * Factory method: Create ProductEntity from plain object
   * Ensures lastUpdated is properly converted to Date
   * @param obj - Plain object with product data
   * @returns ProductEntity instance
   */
  static fromPlain(obj: any): ProductEntity {
    if (!obj || typeof obj !== 'object') {
      throw new Error('Invalid object for ProductEntity creation');
    }

    return new ProductEntity({
      id: obj.id,
      name: obj.name,
      price: obj.price,
      quantity: obj.quantity,
      category: obj.category,
      lastUpdated: obj.lastUpdated ? new Date(obj.lastUpdated) : new Date(),
    });
  }

  // /**
  //  * Convert entity to JSON format for API responses
  //  * @returns JSON representation of the product
  //  */
  // toJSON() {
  //   return {
  //     id: this.id,
  //     name: this.name,
  //     price: this.price,
  //     quantity: this.quantity,
  //     category: this.category,
  //     lastUpdated: this.lastUpdated.toISOString(),
  //   };
  // }

  // /**
  //  * Create a copy of the entity with partial updates
  //  * Useful for immutable updates
  //  * @param updates - Partial product data to update
  //  * @returns New ProductEntity instance with updates
  //  */
  // clone(
  //   updates?: Partial<Omit<ProductEntity, 'id' | 'lastUpdated'>>,
  // ): ProductEntity {
  //   return new ProductEntity({
  //     id: this.id,
  //     name: updates?.name ?? this.name,
  //     price: updates?.price ?? this.price,
  //     quantity: updates?.quantity ?? this.quantity,
  //     category: updates?.category ?? this.category,
  //     lastUpdated: updates ? new Date() : this.lastUpdated,
  //   });
  // }
}

/**
 * Product tier type definition
 * Categorizes products by price range:
 * - budget: $0-$50
 * - mid-range: $50-$200
 * - premium: $200+
 */
export type TierName = 'budget' | 'mid-range' | 'premium';
