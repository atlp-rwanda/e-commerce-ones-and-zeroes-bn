import { OpenAPIV3 } from 'openapi-types';

const usersPath: OpenAPIV3.PathsObject = {
  '/api/user/setUserRole/{id}': {
    put: {
      summary: 'Set Users roles',
      tags: ['Users'],
    
      description: 'System admins   set roles of users in the system',
      
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                role: {
                  type: 'string',
                },
              },
              required: ['role'],
            },
          },
        },
      },
        parameters: [
            {
              in: "path",
              name: "id",
              schema: {
                type: "string"
              },
              required: true,
              description: " ID of the user to set role for"
            }
          ],
          security:[

           {
            token:[],
        
           }
        
          ],
          
      responses: {
        '200': {
          description: 'Role set successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                },
                message:{
                    type:'string'
                },
                data:{
                    type:'object'
                }
              },
            },
            example:{
                status: "success",
                message: "user role updated",
                data: {
                    userId: "6124bb7c-c8b7-4935-8ab8-fed5869f4dd5",
                    firstName: "shyaka7",
                    lastName: "blaise7",
                    email: "shyakablaise7@gmail.com",
                    password: "$2b$10$zc3n880nRKbMN9RBYfaH0.j84cVJnr/7PN.FO2ccBRzEQbpIicalu",
                    isActive: false,
                    isGoogle: false,
                    isAdmin: false,
                    role: "seller",
                    createdAt: "2024-04-23T11:27:16.760Z",
                    updatedAt: 1713943734995
                }
            }
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
                  status:{type:'string'},
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
                  status:{type:'string'},
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
                  status:{type:'string'},
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
                  status:{type:'string'},
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

export default usersPath;
