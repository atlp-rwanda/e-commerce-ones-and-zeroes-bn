import { OpenAPIV3 } from 'openapi-types';
import examples from './Examples/examples';
import users from './Users/users';
import googlePaths from './Users/googleAuth';
import productStatusPath from './product/productStatus';
import loginDocs from './Users/auth';
import updateUserPath from './Users/updateUser';
import productPaths from './product/product';
import searchProductPath from './product/searchProduct';
const allPaths: OpenAPIV3.PathsObject = {
  ...examples,
  ...googlePaths,
  ...users,
  ...productPaths,
  ...productStatusPath,
  ...searchProductPath,
  '/auth/login': loginDocs,
  ...updateUserPath,
};

export default allPaths;
