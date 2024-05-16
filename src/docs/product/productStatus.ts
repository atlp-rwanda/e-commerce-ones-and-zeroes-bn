import { OpenAPIV3 } from 'openapi-types';

const productStatusPath: OpenAPIV3.PathsObject = {
  '/api/products/available': {
    get: {
      summary: 'Product endpoints',
      tags: ['Products'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description:
        'This is the end point for getting available products in our store',
      responses: {
        '200': {
          description: 'A successful response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productName: { type: 'string' },
                        Quantity: { type: 'string' },
                        Price: { type: 'string' },
                        Description: { type: 'string' },
                        Status: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        '404': {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/products/{productId}': {
    put: {
      summary: 'Update product status by ID',
      tags: ['Products'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description: 'Update the status of a product by its ID',
      parameters: [
        {
          in: 'path',
          name: 'productId',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the product to update',
        },
      ],

      responses: {
        '200': {
          description: 'Product status updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '404': {
          description: 'Product not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default productStatusPath;
