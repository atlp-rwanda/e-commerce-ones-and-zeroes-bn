// import { OpenAPIV3 } from 'openapi-types';
import { OpenAPIV3 } from 'openapi-types';

const updateUserPath: OpenAPIV3.PathsObject = {
  '/api/users/': {
    get: {
      summary: 'Get All Users',
      tags: ['Users'],
      description: 'This is endpoint for getting all Users from database',
      parameters: [
        {
          in: 'query',
          name: 'page',
          description: 'pagination page',
          schema: {
            type: 'integer',
          },
        },
        {
          in: 'query',
          name: 'rowsPerPage',
          description: 'pagination rowsPerPage',
          schema: {
            type: 'integer',
          },
        },
      ],
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
                        data: { type: 'object' },
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
  //Get single user using id
  '/api/users/{id}': {
    get: {
      summary: 'Get Single User Profile',
      tags: ['Users'],
      description:
        'This endpoint retrieves a single user from the database based on the provided ID.',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          description: 'ID of the user to retrieve',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  isActive: { type: 'boolean' },
                  isGoogle: { type: 'boolean' },
                  gender: { type: 'string' },
                  birthdate: { type: 'string' },
                  preferredLanguage: { type: 'string' },
                  preferredCurrency: { type: 'string' },
                  billingAddress: { type: 'string' },
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
    //updating user by id
    patch: {
      summary: 'Update Single User Profile',
      tags: ['Users'],
      description:
        "This endpoint updates a single user's profile in the database based on the provided ID.",
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          description: 'ID of the user to update',
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                gender: { type: 'string' },
                birthdate: { type: 'string' },
                preferredLanguage: { type: 'string' },
                preferredCurrency: { type: 'string' },
                billingAddress: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  isActive: { type: 'boolean' },
                  isGoogle: { type: 'boolean' },
                  gender: { type: 'string' },
                  birthdate: { type: 'string' },
                  preferredLanguage: { type: 'string' },
                  preferredCurrency: { type: 'string' },
                  billingAddress: { type: 'string' },
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
  '/api/users/{id}/orders': {
    get: {
      summary: 'get all user orders',
      tags: ['Users'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description: 'This is the endpoint to get all users orders',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          description: 'ID of the user to update',
          schema: {
            type: 'string',
          },
        },

        {
          in: 'query',
          name: 'page',
          description: 'pagination page',
          schema: {
            type: 'integer',
            default: 1,
          },
        },
        {
          in: 'query',
          name: 'pageSize',
          description: 'pagination rowsPerPage',
          schema: {
            type: 'integer',
            default: 10,
          },
        },
      ],

      responses: {
        '200': {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  orders: { type: 'object' },
                  pagination: {
                    type: 'object',
                    properties: {
                      currentPage: { type: 'integer' },
                      pageSize: { type: 'integer' },
                      totalPages: { type: 'integer' },
                      totalOrders: { type: 'integer' },
                    },
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
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        '404': {
          description: 'Resource Not Found',
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

export default updateUserPath;
