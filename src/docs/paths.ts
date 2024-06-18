import { OpenAPIV3 } from 'openapi-types';
import users from './Users/users';
import googlePaths from './Users/googleAuth';
import productStatusPath from './product/productStatus';
import cartPaths from './Carts/cart';
import loginDocs from './Users/auth';
import updateUserPath from './Users/updateUser';
import productPaths from './product/product';
import seller from './seller/seller';
import updtProductPath from './product/updtproduct';
import chatPaths from './chats/chatsPath';
import productReviewPaths from './product/productReview';
const allPaths: OpenAPIV3.PathsObject = {
  ...googlePaths,
  ...users,
  ...productPaths,
  ...productStatusPath,
  ...cartPaths,
  ...seller,
  '/auth/login': loginDocs,
  ...updateUserPath,
  ...productPaths,
  ...updtProductPath,
  ...chatPaths,
  ...productReviewPaths,
};

export default allPaths;
