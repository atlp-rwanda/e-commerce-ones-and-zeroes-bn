import express from 'express';
import {
  createCollection,
  createProduct,
  getProducts,
} from '../controllers/productController';
import isAuthenticated from '../middleware/isAuthMiddleware';
import checkPermission from '../middleware/checkPermissionMiddleware';
import upload from '../middleware/multerConfig';
import { productController } from '../controllers/productStatusController';

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

router.get(
  '/',
  isAuthenticated,
  checkPermission('seller'),
  productController.getProduct,
);
router.get(
  '/available',
  isAuthenticated,
  checkPermission('seller'),
  productController.getAvailableProduct,
);
router.get(
  '/:id',
  isAuthenticated,
  checkPermission('seller'),
  productController.getSingleProduct,
);
router.put(
  '/:productId',
  isAuthenticated,
  checkPermission('seller'),
  productController.updateSingleProduct,
);

export default router;
