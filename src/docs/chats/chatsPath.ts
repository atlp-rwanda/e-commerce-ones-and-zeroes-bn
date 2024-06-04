import { OpenAPIV3 } from 'openapi-types';

const chatPaths: OpenAPIV3.PathsObject = {
  '/api/chats': {
    get: {
      summary: 'Get All Chats',
      tags: ['Chats'],
      description: 'This endpoint retrieves all chats from the public room.',
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'A successful response with all chats',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    message: { type: 'string' },
                    userId: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' },
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
          description: 'Room not found',
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
      summary: 'Add a Chat Message',
      tags: ['Chats'],
      description: 'This endpoint adds a new chat message to the public room.',
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
                message: { type: 'string' },
              },
              required: ['message'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Chat message added successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  chats: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        username: { type: 'string' },
                        message: { type: 'string' },
                        userId: { type: 'string' },
                        timestamp: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Invalid chat data',
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
};

export default chatPaths;
