import { OpenAPIV3 } from 'openapi-types';

const productReviewPaths: OpenAPIV3.PathsObject = {
  '/api/product/{productId}/review': {
    post: {
      summary: 'Review a product',
      tags: ['ProductReviews'],
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
                reviewComment: {
                  type: 'string',
                },
                rating: {
                  type: 'number',
                },
              },
              required: ['reviewComment', 'rating'],
            },
          },
        },
      },
      parameters: [
        {
          in: 'path',
          name: 'productId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'ID of the product to be reviewed',
        },
      ],
      responses: {
        '201': {
          description: 'Review recorded successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                },
                required: ['message'],
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
    put: {
      summary: 'Edit a product review',
      tags: ['ProductReviews'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: 'path',
          name: 'productId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'ID of the product to be reviewed',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                reviewComment: {
                  type: 'string',
                },
                rating: {
                  type: 'number',
                },
              },
              required: ['reviewComment', 'rating'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Review edited successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                },
                required: ['message'],
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
    delete: {
      summary: 'Delete a product review',
      tags: ['ProductReviews'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: 'path',
          name: 'productId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'ID of the product reviewed',
        },
      ],
      responses: {
        '200': {
          description: 'Review deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                },
                required: ['message'],
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
    get: {
      summary: 'get All reviews of a product',
      tags: ['ProductReviews'],

      parameters: [
        {
          in: 'path',
          name: 'productId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'ID of the product reviewed',
        },
      ],
      responses: {
        '200': {
          description: 'Review retrieved successfully successfully',
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
                      properties: {
                        id: {
                          type: 'string',
                        },
                        productId: {
                          type: 'string',
                        },
                        userId: {
                          type: 'string',
                        },
                        reviewComment: {
                          type: 'string',
                        },
                        rating: {
                          type: 'number',
                        },
                      },
                    },
                  },
                },
                required: ['message'],
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

  'api/product/{productId}': {
    delete: {
      summary: 'Delete all reviews of a product ',
      tags: ['ProductReviews'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: 'path',
          name: 'productId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'ID of the product reviewed',
        },
      ],
      responses: {
        '200': {
          description: 'Review deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                },
                required: ['message'],
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
};

export default productReviewPaths;
