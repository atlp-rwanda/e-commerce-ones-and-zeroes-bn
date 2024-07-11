import { OpenAPIV3 } from 'openapi-types';

const productPaths: OpenAPIV3.PathsObject = {
  '/api/products/search/{searchKeyword}/': {
    get: {
      summary: 'Get products',
      tags: ['Products'],
      description:
        'Get product,Search a product by name, category, and price range',
      parameters: [
        {
          in: 'query',
          name: 'searchKeyword',
          required: false,
          schema: {
            type: 'string',
          },
          description: 'Search keyword',
        },
        {
          in: 'query',
          name: 'minPrice',
          required: false,
          schema: {
            type: 'number',
          },
          description: 'Minimum price of the products',
        },
        {
          in: 'query',
          name: 'maxPrice',
          required: false,
          schema: {
            type: 'number',
          },
          description: 'Maximum price of the products',
        },
      ],
      responses: {
        '200': {
          description: 'A successful response',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    name: {
                      type: 'string',
                    },
                    category: {
                      type: 'string',
                    },
                    price: {
                      type: 'number',
                    },
                    isAvailable: {
                      type: 'boolean',
                    },
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
                  error: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '404': {
          description: 'No result found',
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
                  error: {
                    type: 'object',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/products/mine/{id}': {
    get: {
      summary: 'Get all products for a user',
      tags: ['Products'],
      description:
        'This endpoint retrieves all products from the database for a specific user by user ID.',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'ID of the user to retrieve products for',
        },
      ],
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    productId: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    quantity: { type: 'number' },
                    images: { type: 'string' },
                    discount: { type: 'number' },
                    expiryDate: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        '404': {
          description: 'No products found',
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
                  error: { type: 'object' },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/products': {
    post: {
      summary: 'Create a new collection',
      tags: ['Collections'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
              },
              required: ['name'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Collection created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                  },
                  name: {
                    type: 'string',
                  },
                },
                required: ['id', 'name'],
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
                  error: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '404': {
          description: 'Not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
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
                  error: {
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
  '/api/products/{collectionId}/': {
    post: {
      summary: 'Add a product to a collection',
      tags: ['Products'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: 'path',
          name: 'collectionId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'ID of the collection to which the product belongs',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                price: {
                  type: 'number',
                },

                category: {
                  type: 'string',
                },
                quantity: {
                  type: 'integer',
                  default: 1,
                },
                expiryDate: {
                  type: 'string',
                  format: 'date',
                },
                bonus: {
                  type: 'string',
                },
                images: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
              required: ['name', 'price', 'category', 'images', 'quantity'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Product added successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                  },
                  name: {
                    type: 'string',
                  },
                  price: {
                    type: 'number',
                  },
                  category: {
                    type: 'string',
                  },
                  quantity: {
                    type: 'integer',
                  },
                  expiryDate: {
                    type: 'string',
                    format: 'date',
                  },
                  bonus: {
                    type: 'string',
                  },
                  images: {
                    type: 'array',
                    items: {
                      type: 'string',
                      format: 'url',
                    },
                  },
                },
                required: [
                  'id',
                  'name',
                  'price',
                  'category',
                  'images',
                  'quantity',
                ],
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
                  error: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '404': {
          description: 'Not found',
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
  '/api/products/{id}': {
    delete: {
      summary: 'Delete product',
      tags: ['Products'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description: 'This is the endpoint for deleting a product by its ID',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the product to delete',
        },
      ],
      responses: {
        '200': {
          description: 'Product deleted successfully',
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
  '/api/products/recommend': {
    post: {
      summary: 'Get recommended products',
      tags: ['Products'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                productId: {
                  type: 'string',
                },
              },
              required: ['productId'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Recommended products retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                  products: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          format: 'uuid',
                        },
                        name: {
                          type: 'string',
                        },
                        collectionId: {
                          type: 'string',
                        },
                        isAvailable: {
                          type: 'boolean',
                        },
                      },
                      required: ['id', 'name', 'collectionId', 'isAvailable'],
                    },
                  },
                },
                required: ['message', 'products'],
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
                  error: {
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
                  error: {
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
                  error: {
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
  '/api/products/collections/list': {
    get: {
      summary: 'Get user Collections',
      tags: ['Collections'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description: 'This an end point to get user Collections',

      responses: {
        '200': {
          description: 'Collections list retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
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
          description: 'User not found',
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
  '/api/products/:collectionid/products': {
    get: {
      summary: 'Produts per Collection',
      tags: ['Collections'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description: 'This an end point to get Products in a seller Collection',

      parameters: [
        {
          in: 'path',
          name: 'collectionid',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the collection ',
        },
      ],
      responses: {
        '200': {
          description: 'Products retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
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
          description: 'User not found',
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
  '/api/products/collection/:collectionid': {
    delete: {
      summary: 'Delete a Collection',
      tags: ['Collections'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      description: 'This an end point to  delete a Collection',

      parameters: [
        {
          in: 'path',
          name: 'collectionid',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the collection to delete',
        },
      ],
      responses: {
        '200': {
          description: 'Collection deleted  successfully',
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
          description: 'User or collection not found',
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

export default productPaths;
