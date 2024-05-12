import { OpenAPIV3 } from 'openapi-types';

const sellerPath: OpenAPIV3.PathsObject = {
  '/api/users/toggle2FA': {
    post: {
      summary: 'Enable or disable 2FA for a seller',
      tags: ['seller'],
      description:
        'Enable or disable two-factor authentication for a seller. Only sellers are allowed to perform this action.',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: '2FA status updated successfully',
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
          description: 'User not authenticated',
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
          description: 'Only sellers can toggle 2FA',
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
          description: 'User not found',
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
  '/api/users/2fa-verify/{userId}': {
    post: {
      summary: 'Verify 2FA token for a seller',
      tags: ['seller'],
      description:
        'Verify the provided 2FA token for a seller and generate a JWT token upon successful verification.',
      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'ID of the user',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: { type: 'string' },
              },
              required: ['token'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: '2FA token verified successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  verified: { type: 'boolean' },
                  token: { type: 'string' },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized - incorrect token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  verified: { type: 'boolean' },
                  message: { type: 'string' },
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

export default sellerPath;
