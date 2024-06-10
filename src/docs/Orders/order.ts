import { OpenAPIV3 } from 'openapi-types';

const orderPaths: OpenAPIV3.PathsObject = {
  '/api/orders/{orderId}': {
    get: {
      summary: 'get order information',
      tags: ['Orders'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description: 'This is the endpoint to get order information',
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          description: 'id of the order',
          schema: {
            type: 'string',
            minimum: 1,
          },
        },
      ],
      responses: {
        '200': {
          description: 'success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  order: { type: 'object' },
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
  '/api/orders/': {
    post: {
      summary: 'create an order',
      tags: ['Orders'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description: 'This is the endpoint to create an order',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'number' },
                addressId: { type: 'string' },
              },
              required: ['productId', 'quantity', 'addressId'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'successs',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  order: { type: 'object' },
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
        '403': {
          description: 'Prohibited',
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
  '/api/orders/{orderId}/confirm': {
    put: {
      summary: 'confirm order payment',
      tags: ['Orders'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description: 'This is the endpoint to confirm order payment',
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          description: 'id of the order',
          schema: {
            type: 'string',
            minimum: 1,
          },
        },
      ],
      responses: {
        '200': {
          description: 'success',
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
        '403': {
          description: 'Prohibited',
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
};

export default orderPaths;
