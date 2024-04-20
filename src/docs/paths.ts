import { OpenAPIV3 } from 'openapi-types';
import examples from './Examples/examples';
import users from './Users/users';


const allPaths: OpenAPIV3.PathsObject = {
  ...examples,
  ...users

  // Add more imports and spread their paths if you have more files
};

export default allPaths;
