import { Injectable } from '@nestjs/common';

/**
 * AppService
 *
 * Main application service that provides API documentation and information
 * about available endpoints for testing the Product Price Index system
 */
@Injectable()
export class AppService {
  /**
   * Get the welcome message with API usage instructions as HTML
   * This provides an interactive API documentation page
   *
   * @returns {string} Formatted HTML API documentation
   */
  getHello(): string {
    // Get the current protocol and host from request if needed
    // For now, using relative URLs that work on any domain
    const apiEndpoints = [
      {
        method: 'GET',
        path: '/api/products',
        description: 'GET ALL PRODUCTS',
        body: null,
      },
      {
        method: 'GET',
        path: '/api/products/iphone-001',
        description: 'GET BY ID',
        body: null,
      },
      {
        method: 'GET',
        path: '/api/products?minPrice=100&maxPrice=500',
        description: 'PRICE RANGE QUERY',
        body: null,
      },
      {
        method: 'GET',
        path: '/api/products?category=Electronics',
        description: 'FILTER BY CATEGORY',
        body: null,
      },
      {
        method: 'GET',
        path: '/api/products?tier=budget',
        description: 'FILTER BY TIER',
        body: null,
      },
      {
        method: 'GET',
        path: '/api/products/count',
        description: 'GET COUNT',
        body: null,
      },
      {
        method: 'GET',
        path: '/api/products/stats/summary',
        description: 'GET STATISTICS',
        body: null,
      },
      {
        method: 'GET',
        path: '/api/products/budget/100',
        description: 'FIND MOST EXPENSIVE WITHIN BUDGET',
        body: null,
      },
      {
        method: 'GET',
        path: '/api/products/above-price/100',
        description: 'FIND CHEAPEST ABOVE PRICE',
        body: null,
      },
      {
        method: 'GET',
        path: '/api/products/page?page=0&pageSize=3',
        description: 'PAGINATE BY PRICE RANK (O(log n + k))',
        body: null,
      },
      {
        method: 'GET',
        path: '/api/products/cheapest/3',
        description: 'TOP N CHEAPEST PRODUCTS',
        body: null,
      },
      {
        method: 'GET',
        path: '/api/products/expensive/3',
        description: 'TOP N MOST EXPENSIVE PRODUCTS',
        body: null,
      },
      {
        method: 'GET',
        path: '/api/products/cable-001/percentile',
        description: 'PRICE PERCENTILE + DYNAMIC TIER',
        body: null,
      },
      {
        method: 'GET',
        path: '/api/products/stats/median',
        description: 'GET MEDIAN-PRICED PRODUCT (O(log n))',
        body: null,
      },
      {
        method: 'PUT',
        path: '/api/products/p1',
        description: 'UPDATE PRODUCT',
        body: '{ "price": 899.99, "quantity": 8 }',
      },
      {
        method: 'DELETE',
        path: '/api/products/iphone-001',
        description: 'DELETE PRODUCT',
        body: null,
      },
      {
        method: 'POST',
        path: '/api/products/discount/apply',
        description: 'APPLY DISCOUNT',
        body: '{ "minPrice": 100, "maxPrice": 500, "discountPercent": 10 }',
      },
      {
        method: 'POST',
        path: '/api/products',
        description: 'CREATE PRODUCT',
        body: '{ "id": "p1", "name": "Laptop", "price": 999.99, "quantity": 10, "category": "Electronics" }',
      },
    ];

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Product Price Index API</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 40px 20px;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                overflow: hidden;
            }

            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 60px 40px;
                text-align: center;
            }

            .header h1 {
                font-size: 2.5em;
                margin-bottom: 10px;
            }

            .header p {
                font-size: 1.1em;
                opacity: 0.9;
            }

            .content {
                padding: 40px;
            }

            .section-title {
                font-size: 1.3em;
                color: #333;
                margin: 30px 0 20px 0;
                padding-bottom: 10px;
                border-bottom: 2px solid #667eea;
            }

            .api-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .api-card {
                background: #f8f9fa;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 20px;
                transition: all 0.3s ease;
                cursor: pointer;
                display: flex;
                flex-direction: column;
            }

            .api-card:hover {
                background: #f0f0f0;
                border-color: #667eea;
                box-shadow: 0 8px 16px rgba(102, 126, 234, 0.15);
                transform: translateY(-2px);
            }

            .api-method {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 4px;
                font-weight: bold;
                font-size: 0.85em;
                margin-bottom: 10px;
                width: fit-content;
                color: white;
            }

            .method-get {
                background-color: #4CAF50;
            }

            .method-post {
                background-color: #2196F3;
            }

            .method-put {
                background-color: #FF9800;
            }

            .method-delete {
                background-color: #f44336;
            }

            .api-path {
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
                color: #666;
                margin-bottom: 8px;
                word-break: break-all;
            }

            .api-description {
                font-size: 0.95em;
                color: #333;
                margin-bottom: 12px;
                font-weight: 500;
            }

            .api-link {
                display: inline-block;
                padding: 10px 16px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-size: 0.9em;
                text-align: center;
                transition: background 0.3s ease;
                margin-top: auto;
            }

            .api-link:hover {
                background: #764ba2;
            }

            .api-body {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 10px 12px;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 0.75em;
                color: #856404;
                margin-top: 10px;
                overflow-x: auto;
                word-break: break-all;
                white-space: pre-wrap;
            }

            .info-box {
                background: #e8f5e9;
                border-left: 4px solid #4CAF50;
                padding: 15px;
                border-radius: 4px;
                margin: 20px 0;
                color: #2e7d32;
            }

            .info-box strong {
                display: block;
                margin-bottom: 5px;
            }

            .tier-info {
                background: #e3f2fd;
                border-left: 4px solid #2196F3;
                padding: 15px;
                border-radius: 4px;
                margin: 20px 0;
                color: #1565c0;
                font-size: 0.95em;
            }

            .tier-info strong {
                display: block;
                margin-bottom: 5px;
            }

            @media (max-width: 768px) {
                .header h1 {
                    font-size: 1.8em;
                }

                .api-grid {
                    grid-template-columns: 1fr;
                }

                .content {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Product Price Index API</h1>
                <p>Interactive API Documentation & Testing</p>
            </div>

            <div class="content">
                <div class="info-box">
                    <strong>📌 API Base URL:</strong>
                    Click on any endpoint below to test it directly
                </div>

                <div class="section-title">📝 Available Endpoints</div>

                <div class="api-grid">
                    ${apiEndpoints
                      .map(
                        (endpoint, index) => `
                        <div class="api-card">
                            <span class="api-method method-${endpoint.method.toLowerCase()}">${
                          endpoint.method
                        }</span>
                            <div class="api-description">${index + 1}. ${
                          endpoint.description
                        }</div>
                            <div class="api-path">${endpoint.path}</div>
                            ${
                              endpoint.body
                                ? `<div class="api-body"><strong>Body:</strong>\n${endpoint.body}</div>`
                                : ''
                            }
                            <a href="${
                              endpoint.path
                            }" class="api-link" target="_blank">
                                🚀 Test Endpoint
                            </a>
                        </div>
                    `,
                      )
                      .join('')}
                </div>

                <div class="section-title">📚 Information</div>

                <div class="tier-info">
                    <strong>💰 Price Tier Categories:</strong>
                    • <strong>budget:</strong> $0 - $50<br>
                    • <strong>mid-range:</strong> $50 - $200<br>
                    • <strong>premium:</strong> $200+
                </div>

                <div class="info-box">
                    <strong>✨ Sample Data:</strong>
                    8 sample products are automatically loaded when the service starts. You can use the endpoints above to query, create, update, and delete products.
                </div>

            </div>
        </div>

        <script>
            // Enhance click behavior for better UX
            document.querySelectorAll('.api-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    // Keep the default behavior (open in new tab)
                    console.log('Opening endpoint:', this.href);
                });

                // Show hover effect feedback
                link.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                });

                link.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            });
        </script>
    </body>
    </html>
    `;
  }
}
