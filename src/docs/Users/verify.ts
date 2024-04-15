import { OpenAPIV3 } from 'openapi-types';

const registerPath: OpenAPIV3.PathsObject = {
  '/api/user/isVerified/{token}': {
    post: {
      // Corrected method to 'post'
      summary: 'User verification',
      tags: ['User Routes'],
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

      requestBody: {
        // Corrected request body structure
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'Verification token',
                },
              },
              required: ['token'],
            },
          },
        },
      },

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
};

export default registerPath;
