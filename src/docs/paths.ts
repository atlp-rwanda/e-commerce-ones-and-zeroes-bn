import { OpenAPIV3 } from 'openapi-types';
import examples from './Examples/examples';
import googlePaths from './Users/googleAuth';
const allPaths: OpenAPIV3.PathsObject = {
  ...examples,
  ...googlePaths,

  // Add more imports and spread their paths if you have more files
};

export default allPaths;
