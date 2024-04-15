import { OpenAPIV3 } from 'openapi-types';
import examples from './Examples/examples';
import users from './Users/users';
import verify from './Users/verify';

const allPaths: OpenAPIV3.PathsObject = {
  ...examples,
  ...users,
  ...verify,

  // Add more imports and spread their paths if you have more files
};

export default allPaths;
