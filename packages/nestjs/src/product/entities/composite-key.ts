/**
 * Composite Key Interface
 * Used as the key in RedBlackTree for efficient price-based indexing
 * Combines price and productId to handle multiple products at same price
 *
 * Why composite key?
 * - Price alone is not unique (multiple products can have same price)
 * - Price + ProductId ensures uniqueness in the tree
 * - Allows efficient range queries by price
 */
export interface CompositeKey {
  /**
   * Product price - primary sort key (ascending order)
   * All products are indexed and sorted by this value
   */
  price: number;

  /**
   * Product ID - secondary sort key (breaks ties when prices are equal)
   * Ensures no two keys are identical in the tree
   * String comparison used for tie-breaking
   */
  productId: string;

  /**
   * Compare two composite keys for tree ordering
   * Returns: -1 if this < other, 0 if equal, 1 if this > other
   *
   * @param other - The other composite key to compare
   * @returns Comparison result for tree ordering
   */
  compareTo?(other: CompositeKey): number;
}
