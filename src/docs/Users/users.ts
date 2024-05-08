import { OpenAPIV3 } from 'openapi-types';

const userPaths: OpenAPIV3.PathsObject = {
  '/api/user/registerUser': {
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
                role:{type:'string'},
              },
              required: ['firstName', 'lastName', 'email', 'password','role'],
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
                  role:{type:'string'},
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
 
  '/api/user/loginUser': {
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

  '/api/user/2fa-verify': {
    post: {
      summary: '2fa-verify',
      tags: ['Users'],
      description:
        'This endpoint allows users to log in by providing their 2fa.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                userId: {
                  type: 'string',
                  description: "The user's id",
                  example: "3fe5d80b-2bb6-48c6-83d1-3ae7115c3eb0",
                },
                token: {
                  type: 'string',
                  description: "The 2FA ",
                  example: '43675376',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'verification true',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'true',
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


};

export default userPaths;