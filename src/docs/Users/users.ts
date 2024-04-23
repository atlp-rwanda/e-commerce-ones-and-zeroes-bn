import { OpenAPIV3 } from "openapi-types";

const usersPath: OpenAPIV3.PathsObject = {
  "/api/user": {
    get: {
      summary: "Get All Users",
      tags: ["Users  Routes:"],
      description: "This is endpoint for getting all Users from database",
      responses: {
        "200": {
          description: "A successful response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        userId:{type: 'string'},
                        firstName:{type: 'string'},
                        lastName:{type: 'string'},
                        email:{type: 'string'},
                        isActve:{type: 'boolean'},
                        isGoogle:{type: 'boolean'},
                        gender:{type: 'string'},
                        birthdate:{type: 'string'},
                        preferredLanguage:{type: 'string'},
                        preferredCurrency:{type: 'string'},
                        billingAddress:{type: 'string'}
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Bad request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
            },
          },
        },
        "404": {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
            },
          },
        },
        "500": {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },

  },
  //Get single user using id
  "/api/user/{id}": {
    get: {
      summary: "Get Single User Profile",
      tags: ["Users  Routes:"],
      description: "This endpoint retrieves a single user from the database based on the provided ID.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID of the user to retrieve",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        "200": {
          description: "Successful response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string" },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string" },
                  isActive: { type: "boolean" },
                  isGoogle: { type: "boolean" },
                  gender: { type: "string" },
                  birthdate: { type: "string" },
                  preferredLanguage: { type: "string" },
                  preferredCurrency: { type: "string" },
                  billingAddress: { type: "string" }
                }
              }
            }
          }
        },
        "400": {
          description: "Bad request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" }
                }
              }
            }
          }
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" }
                }
              }
            }
          }
        },
        "404": {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" }
                }
              }
            }
          }
        },
        "500": {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" }
                }
              }
            }
          }
        }
      }
    }
  },
  "/api/user/editUser/{id}": {
    "patch": {
      "summary": "Update Single User Profile",
      "tags": ["Users  Routes:"],
      "description": "This endpoint updates a single user's profile in the database based on the provided ID.",
      "parameters": [
        {
          "in": "path",
          "name": "id",
          "required": true,
          "description": "ID of the user to update",
          "schema": {
            "type": "string"
          }
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "firstName": { "type": "string" },
                "lastName": { "type": "string" },
                "email": { "type": "string" },
                "isActive": { "type": "boolean" },
                "isGoogle": { "type": "boolean" },
                "gender": { "type": "string" },
                "birthdate": { "type": "string" },
                "preferredLanguage": { "type": "string" },
                "preferredCurrency": { "type": "string" },
                "billingAddress": { "type": "string" }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Successful response",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "userId": { "type": "string" },
                  "firstName": { "type": "string" },
                  "lastName": { "type": "string" },
                  "email": { "type": "string" },
                  "isActive": { "type": "boolean" },
                  "isGoogle": { "type": "boolean" },
                  "gender": { "type": "string" },
                  "birthdate": { "type": "string" },
                  "preferredLanguage": { "type": "string" },
                  "preferredCurrency": { "type": "string" },
                  "billingAddress": { "type": "string" }
                }
              }
            }
          }
        },
        "400": {
          "description": "Bad request",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": { "type": "string" }
                }
              }
            }
          }
        },
        "401": {
          "description": "Unauthorized",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": { "type": "string" }
                }
              }
            }
          }
        },
        "404": {
          "description": "Resource not found",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": { "type": "string" }
                }
              }
            }
          }
        },
        "500": {
          "description": "Internal server error",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": { "type": "string" }
                }
              }
            }
          }
        }
      }
    }
  }
  
};

export default usersPath;
