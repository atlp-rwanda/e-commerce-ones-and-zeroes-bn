import express from 'express';
import {
  createCollection,
  createProduct,
  getProducts,
} from '../controllers/productController';
import isAuthenticated from '../middleware/isAuthMiddleware';
import checkPermission from '../middleware/checkPermissionMiddleware';
import upload from '../middleware/multerConfig';

const router = express.Router();
router.get('/', getProducts);
router.post('/', isAuthenticated, checkPermission('seller'), createCollection);
router.post(
  '/:collectionId',
  isAuthenticated,
  checkPermission('seller'),
  upload.array('images'),
  createProduct,
);

export default router;
