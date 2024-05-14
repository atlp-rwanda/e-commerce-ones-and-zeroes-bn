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
};

export default googlePaths;
