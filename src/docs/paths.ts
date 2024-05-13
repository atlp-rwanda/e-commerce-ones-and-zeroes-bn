import { OpenAPIV3 } from 'openapi-types';
import examples from './Examples/examples';
import users from './Users/users';
import googlePaths from './Users/googleAuth';
import loginDocs from './Users/auth';
import updateUserPath from './Users/updateUser';
const allPaths: OpenAPIV3.PathsObject = {
  ...examples,
  ...googlePaths,
  ...users,
  '/auth/login': loginDocs,
  ...updateUserPath,
};

export default allPaths;
