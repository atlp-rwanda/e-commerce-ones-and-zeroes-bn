import { OpenAPIV3 } from 'openapi-types';
import examples from './Examples/examples';
import users from './Users/users';
import googlePaths from './Users/googleAuth';
import productStatusPath from './product/productStatus';
import cartPaths from './Carts/cart';
import loginDocs from './Users/auth';
import updateUserPath from './Users/updateUser';
import productPaths from './product/product';
import updtProductPath from './product/updtproduct';
import chatPaths from './chats/chatsPath';
import productReviewPaths from './product/productReview';
const allPaths: OpenAPIV3.PathsObject = {
  ...examples,
  ...googlePaths,
  ...users,
  ...productPaths,
  ...productStatusPath,
  ...cartPaths,
  '/auth/login': loginDocs,
  ...updateUserPath,
  ...productPaths,
  ...updtProductPath,
  ...chatPaths,
  ...productReviewPaths,
};

export default allPaths;
