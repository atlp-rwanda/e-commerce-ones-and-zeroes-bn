import express from 'express';
import {
  createCollection,
  createProduct,
  getProducts,
} from '../controllers/productController';
import isAuthenticated from '../middleware/isAuthMiddleware';
import checkPermission from '../middleware/checkPermissionMiddleware';
import upload from '../middleware/multerConfig';
import ProductController from '../controllers/productController';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware';
import uploads from '../middleware/multer';
import cloudinary from '../helps/cloudinaryConfig';

const router = express.Router();
router.get(
  '/',
  isAuthenticated,
  authMiddleware.checkRole('admin'),
  getProducts,
);
router.post('/', isAuthenticated, checkPermission('seller'), createCollection);
router.post(
  '/:collectionId',
  isAuthenticated,
  checkPermission('seller'),
  upload.array('images'),
  createProduct,
);

router.get('/', isAuthenticated, checkPermission('admin'), getProducts);
router.get(
  '/available',
  isAuthenticated,
  checkPermission('seller'),
  ProductController.getAvailableProduct,
);
router.get(
  '/:id',
  isAuthenticated,
  checkPermission('seller'),
  ProductController.getSingleProduct,
);

router.get('/:productId', isAuthenticated, ProductController.getSingleProduct);
router.put(
  '/:productId',
  isAuthenticated,
  checkPermission('seller'),
  ProductController.updateSingleProduct,
);
router.patch(
  '/:productId',
  isAuthenticated,
  checkPermission('seller'),
  uploads.array('images'),
  ProductController.updateProduct,
);
router.post(
  '/remove-image',
  isAuthenticated,
  checkPermission('seller'),
  ProductController.removeProductImage,
);

export default router;
