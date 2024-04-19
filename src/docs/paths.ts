import { OpenAPIV3 } from 'openapi-types';
import examples from './Examples/examples';
import users from './Users/users';
import loginDocs from './Users/auth';

const allPaths: OpenAPIV3.PathsObject = {
  ...examples,
  ...users,
  '/auth/login': loginDocs,
};

export default allPaths;
