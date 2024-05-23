import { OpenAPIV3 } from 'openapi-types';

const updtProductPath: OpenAPIV3.PathsObject = {
  '/api/products': {
    get: {
      summary: 'Get All Products endPoint',
      tags: ['Products Routes'],
      description: 'this is endpoint to retrieve all products in the database',
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  name: { type: 'string' },
                  decription: { type: 'string' },
                  price: { type: 'string' },
                  quantity: { type: 'string' },
                  images: { type: 'string' },
                  discount: { type: 'string' },
                  expirtdate: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
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
  '/api/products/{id}': {
    get: {
      summary: 'Get single product endPoint',
      tags: ['Products Routes'],
      description:
        'This is endpoint to retrieve a single product in the database',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          description: 'ID of the product to retrieve',
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
                  productId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'string' },
                  quantity: { type: 'string' },
                  images: { type: 'string' },
                  discount: { type: 'string' },
                  expiryDate: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
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
    put: {
      summary: 'Update product endPoint',
      tags: ['Products Routes'],
      description: 'This is endpoint to update a product in the database',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          description: 'ID of the product to update',
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'string' },
                category: { type: 'string' },
                bonus: { type: 'string' },
                quantity: { type: 'string' },
                discount: { type: 'string' },
                images: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary',
                  },
                },
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
                  productId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'string' },
                  quantity: { type: 'string' },
                  images: { type: 'string' },
                  discount: { type: 'string' },
                  expiryDate: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
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

  '/api/products/remove-image': {
    post: {
      summary: 'Deleting image of product endPoint',
      tags: ['Products Routes'],
      description: 'this is endpoint to delete product image in the database',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                images: { type: 'string' },
                
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
                  productId: { type: 'string' },
                  name: { type: 'string' },
                  decription: { type: 'string' },
                  price: { type: 'string' },
                  quantity: { type: 'string' },
                  images: { type: 'string' },
                  discount: { type: 'string' },
                  expirtdate: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
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
    }
  },
}

export default updtProductPath
