import { OpenAPIV3 } from 'openapi-types';

const addressPaths: OpenAPIV3.PathsObject = {
  '/api/addresses/': {
    get: {
      summary: 'get user address',
      tags: ['Addresses'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description: 'This is the endpoint to get address information',
      responses: {
        '200': {
          description: 'success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  data: { type: 'object' },
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
    post: {
      summary: 'create user address',
      tags: ['Addresses'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description: 'This is the endpoint to create a user address',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                country: { type: 'string' },
                province: { type: 'string' },
                district: { type: 'string' },
                sector: { type: 'string' },
                street: { type: 'string' },
              },
              required: ['country', 'province', 'district', 'sector', 'street'],
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
                  message: { type: 'string' },
                  data: { type: 'object' },
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
    put: {
      summary: 'update user address',
      tags: ['Addresses'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description: 'This is the endpoint to update a user address',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                country: { type: 'string' },
                province: { type: 'string' },
                district: { type: 'string' },
                sector: { type: 'string' },
                street: { type: 'string' },
              },
              required: ['country', 'province', 'district', 'sector', 'street'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  data: { type: 'object' },
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
    delete: {
      summary: 'delete a user address',
      tags: ['Addresses'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description: 'This is the endpoint to delete a user address',
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

export default addressPaths;
