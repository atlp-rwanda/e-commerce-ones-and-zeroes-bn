import { OpenAPIV3 } from 'openapi-types';

export const examplesPath: OpenAPIV3.PathsObject = {
  '/api/examples': {
    get: {
      summary: 'Get examples format',
      tags: ['Examples'],
      description: 'Refer to these examples to create your own documentation.',
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
                        id: { type: 'number' },
                        name: { type: 'string' },
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
  
};

export const userPath: OpenAPIV3.PathsObject = {
  '/api/login': {
    post: {
      summary: 'User Login',
      tags: ['Users'],
      description: 'Users with account can log in',
      requestBody : {
        required: true,
        content : {
          "application/json" : {
            schema : {
              type: "object",
              properties : {
                email : {
                  type: "string",
                },
                password : {
                  type : "string",
                },
              },
              "required" : ["email", "password"]
            },
            
          },
        },
      },
      
      responses: {
        '200': {
          description: 'User logged in successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: "string",                    
                  },
                  message: {
                    type: "string",
                  },
                  token: {
                    type: "string"
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
                  status : {
                    type: "string"
                  },
                  message : {
                    type: "string"
                  }
                },
              },
            },
          },
        },
        '400': {
          description: 'Wrong credentials',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: "string",
                    },
                  message : {
                    type : "string"
                  }
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
                    type: "string"
                  },
                  message : {
                    type: "string"
                  }
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/user/changepassword': {
    put: {
      summary: 'Change user password',
      tags: ['Users'],
      description: 'Authenticated users can change their password',
      security: [{
        bearerAuth: [],
      }],
      requestBody : {
        required: true,
        content : {
          "application/json" : {
            schema : {
              type: "object",
              properties : {
                password : {
                  type: "string",
                },
                newPassword : {
                  type : "string",
                },
                verifyNewPassword : {
                  type: "string",
                }
              },
              "required" : ["password", "newPassword","verifyNewPassword"]
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
                    type: "string",                    
                  },
                  message: {
                    type: "string",
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
                  status : {
                    type: "string"
                  },
                  message : {
                    type: "string"
                  }
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
                    type: "string",
                    },
                  message : {
                    type : "string"
                  }
                },
              },
            },
          },
        },
        '400': {
          description: 'Password mismatch',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: "string",
                    },
                  message : {
                    type : "string"
                  }
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
                    type: "string"
                  },
                  message : {
                    type: "string"
                  }
                },
              },
            },
          },
        },
      },
    },
  },
}




