import { OpenAPIV3 } from 'openapi-types';
import examples from './Examples/examples';
import users from './Users/users';
import googlePaths from './Users/googleAuth';
import loginDocs from './Users/auth';
import updateUserPath from './Users/updateUser';
import productPaths from './product/product';
const allPaths: OpenAPIV3.PathsObject = {
  ...examples,
  ...googlePaths,
  ...users,
  '/auth/login': loginDocs,
  ...updateUserPath,
  ...productPaths,
};

export default allPaths;
