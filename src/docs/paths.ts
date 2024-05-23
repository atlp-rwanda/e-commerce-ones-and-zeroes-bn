import { OpenAPIV3 } from 'openapi-types';
import examples from './Examples/examples';
import users from './Users/users';
import googlePaths from './Users/googleAuth';
import loginDocs from './Users/auth';
import updtProductPath from './product/updtproduct'
const allPaths: OpenAPIV3.PathsObject = {
  ...examples,
  ...googlePaths,
  ...users,
  '/auth/login': loginDocs,
  ...updtProductPath,
};

export default allPaths;
