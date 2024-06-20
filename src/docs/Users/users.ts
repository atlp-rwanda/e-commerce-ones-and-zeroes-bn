import { OpenAPIV3 } from 'openapi-types';

const userPaths: OpenAPIV3.PathsObject = {
  '/api/users/registerUser': {
    post: {
      summary: 'User registration endpoint',
      tags: ['Users'],
      description: 'This is the endpoint to register a new user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
              },
              required: ['firstName', 'lastName', 'email', 'password'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Account created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
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
  '/api/users/forgot-password': {
    post: {
      summary: 'Send password reset email',
      tags: ['Users'],
      description: 'This endpoint sends a password reset email to the user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' },
              },
              required: ['email'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Password reset email sent successfully',
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
                  error: { type: 'string' },
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
                  error: { type: 'string' },
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
                  error: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/users/reset-password/{token}': {
    post: {
      summary: 'Reset user password',
      tags: ['Users'],
      description:
        'This endpoint resets the user password using the provided token',

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                newPassword: { type: 'string' },
              },
              required: ['newPassword'],
            },
          },
        },
      },
      parameters: [
        {
          name: 'token',
          in: 'path',
          description: 'Token to reset password',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        '200': {
          description: 'Password reset successfully',
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
                  error: { type: 'string' },
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
                  error: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/users/login': {
    post: {
      summary: 'Log in a user',
      tags: ['Users'],
      description:
        'This endpoint allows users to log in by providing their email and password.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: "The user's email address.",
                  example: 'user@example.com',
                },
                password: {
                  type: 'string',
                  description: "The user's password.",
                  example: 'password123',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Login successful',
                  },
                  token: {
                    type: 'string',
                    description: 'A JWT token for the logged in user.',
                    example:
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Email and password are required',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Email and password are required',
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Incorrect credentials',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Incorrect credentials',
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
                    example: 'User not found',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/users/isVerified/{token}': {
    post: {
      // Corrected method to 'post'
      summary: 'User verification',
      tags: ['Users'],
      description: 'Endpoint to verify a new user',

      parameters: [
        {
          name: 'token',
          in: 'path',
          description: 'Token to verify user',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],

      responses: {
        '200': {
          description: 'Successfully verified',
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
  '/api/users/disable/{id}': {
    put: {
      summary: 'Disable user account',
      tags: ['Users'],
      description: 'Disable a user account',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'UserId of user account',
          schema: {
            type: 'string',
            minimum: 1,
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
                reason: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'A successful response',
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
  '/api/wishlist/{productId}': {
    post: {
      summary: 'Add product to wishlist',
      tags: ['Wishlist'],
      description:
        'This endpoint allows a user to add a product to their wishlist',
      parameters: [
        {
          name: 'productId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the product to add to the wishlist',
        },
      ],
      security: [{ bearerAuth: [] }],
      responses: {
        '201': {
          description: 'Product added to wishlist successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  wishlistItem: { type: 'object' },
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
          description: 'Product not found',
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
      summary: 'Remove product from wishlist',
      tags: ['Wishlist'],
      description:
        'This endpoint allows a user to remove a product from their wishlist',
      parameters: [
        {
          name: 'productId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the product to add to the wishlist',
        },
      ],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Product removed from wishlist successfully',
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
          description: 'Product not found in wishlist',
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
  '/api/wishlist': {
    get: {
      summary: 'Get user wishlist',
      tags: ['Wishlist'],
      description: 'This endpoint allows a user to retrieve their wishlist',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Wishlist retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    productName: { type: 'string' },
                    productPrice: { type: 'number' },
                  },
                },
              },
            },
          },
        },
        '404': {
          description: 'No items in the wishlist',
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
      summary: 'Clear wishlist',
      tags: ['Wishlist'],
      description: 'This endpoint allows a user to clear their wishlist',
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'Wishlist cleared successfully',
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
  },

  '/api/users/changepassword': {
    put: {
      summary: 'Change user password',
      tags: ['Users'],
      description: 'Authenticated users can change their password',
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
                password: {
                  type: 'string',
                },
                newPassword: {
                  type: 'string',
                },
                verifyNewPassword: {
                  type: 'string',
                },
              },
              required: ['password', 'newPassword', 'verifyNewPassword'],
            },
          },
        },
      },

      responses: {
        '200': {
          description: 'Password updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'string',
                  },
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
                  status: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Wrong credentials',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
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
                  status: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '422': {
          description: 'Joi Validation Error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '403': {
          description: 'FORBIDEN: No Authorization / Token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
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
  '/api/users/notifications': {
    get: {
      summary: 'Read notifications',
      tags: ['Users'],
      description: 'Authenticated users can view their notifications',
      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        '200': {
          description: 'Notification retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
                  data: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '404': {
          description: 'No notification found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
                  data: {
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
                  status: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },

        '403': {
          description: 'FORBIDEN: No Authorization / Token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
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
  '/api/users/notification': {
    put: {
      summary: 'Read single notification',
      tags: ['Users'],
      description:
        'Authenticated users can Read and Mark a notifcation as Read',
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
                notificationId: {
                  type: 'string',
                },
              },
              required: ['notificationId'],
            },
          },
        },
      },

      responses: {
        '200': {
          description: 'Notification retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
                  data: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '404': {
          description: 'No notification found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
                  data: {
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
                  status: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },

        '403': {
          description: 'FORBIDEN: No Authorization / Token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
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

export default userPaths;
