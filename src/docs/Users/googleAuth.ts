import { OpenAPIV3 } from 'openapi-types';
const googlePaths: OpenAPIV3.PathsObject = {
  '/auth': {
    get: {
      summary: 'Get the Google Sign in Page',
      tags: ['Auth'],
      description:
        'Google Api endpoint which uses passport Js and Google Aouth4',
      responses: {
        '200': {
          description: 'A successful Page',
        },
      },
    },
  },
  '/auth/google/callback': {
    get: {
      summary: 'Callback Response from Google',
      description: 'The endpoint where a Google sends Their response',
      tags: ['Auth'],
      responses: {
        '200': {
          description: 'Successufl Authenticated User',
        },
      },
    },
  },
};

export default googlePaths;
