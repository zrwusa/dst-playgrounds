/**
 * Standard API Response Format
 * All API endpoints return responses in this format for consistency
 */
export interface ApiResponse<T = any> {
  /**
   * Indicates if the operation was successful
   * true: operation succeeded
   * false: operation failed
   */
  success: boolean;

  /**
   * Human-readable message describing the result
   * Examples:
   * - "Product created successfully"
   * - "Product updated successfully"
   * - "Products retrieved successfully"
   */
  message: string;

  /**
   * The actual response data
   * Type T is generic - can be a single object, array, or any type
   * Examples:
   * - ProductEntity for single product queries
   * - ProductEntity[] for multiple products
   * - { count: number } for count operations
   * - Statistics object for stats operations
   */
  data?: T;

  /**
   * Optional error details for failed responses
   * Contains error code, detailed message, or stack trace
   * Only present when success is false
   */
  error?: {
    code: string;
    message: string;
    details?: any;
  };

  /**
   * Optional timestamp when response was generated
   * ISO 8601 format
   */
  timestamp?: string;

  /**
   * Optional request ID for tracing/debugging
   * Can be used to correlate logs and track requests
   */
  requestId?: string;
}

/**
 * Example responses:
 *
 * Success with data:
 * {
 *   success: true,
 *   message: "Product created successfully",
 *   data: { id: "p1", name: "Laptop", price: 999.99 }
 * }
 *
 * Success with array:
 * {
 *   success: true,
 *   message: "Products retrieved successfully",
 *   data: [{ id: "p1", ... }, { id: "p2", ... }]
 * }
 *
 * Error:
 * {
 *   success: false,
 *   message: "Product not found",
 *   error: {
 *     code: "NOT_FOUND",
 *     message: "Product with id 'invalid-id' does not exist"
 *   }
 * }
 */
