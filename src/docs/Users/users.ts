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
  // //get single user
  // "/api/user/:id": {
  //   get: {
  //     summary: "Get Single User Profile",
  //     tags: ["Users  Routes:"],
  //     description: "This is endpoint for getting Single User from database",
  //     responses: {
  //       "200": {
  //         description: "A successful response",
  //         content: {
  //           "application/json": {
  //             schema: {
  //               type: "object",
  //               properties: {
  //                 data: {
  //                   type: "array",
  //                   items: {
  //                     type: "object",
  //                     properties: {
  //                       userId:{type: 'string'},
  //                       firstName:{type: 'string'},
  //                       lastName:{type: 'string'},
  //                       email:{type: 'string'},
  //                       isActve:{type: 'boolean'},
  //                       isGoogle:{type: 'boolean'},
  //                       gender:{type: 'string'},
  //                       birthdate:{type: 'string'},
  //                       preferredLanguage:{type: 'string'},
  //                       preferredCurrency:{type: 'string'},
  //                       billingAddress:{type: 'string'}
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       "400": {
  //         description: "Bad request",
  //         content: {
  //           "application/json": {
  //             schema: {
  //               type: "object",
  //               properties: {
  //                 message: { type: "string" },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       "401": {
  //         description: "Unauthorized",
  //         content: {
  //           "application/json": {
  //             schema: {
  //               type: "object",
  //               properties: {
  //                 message: { type: "string" },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       "404": {
  //         description: "Resource not found",
  //         content: {
  //           "application/json": {
  //             schema: {
  //               type: "object",
  //               properties: {
  //                 message: { type: "string" },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       "500": {
  //         description: "Internal server error",
  //         content: {
  //           "application/json": {
  //             schema: {
  //               type: "object",
  //               properties: {
  //                 message: { type: "string" },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       parameters:{
  //         name:"id",
  //         in:"path",
  //         require:true,
  //         description:"User Id",
  //         schema:{
  //           type: "string"
  //         }
  //       }
  //     },
  //   },
    
  // },
};

export default usersPath;
