import express from 'express';
import {
  createCollection,
  createProduct,
  getProducts,
  getUserCollections,
  getProductsPerCollection,
  deleteCollection,
} from '../controllers/productController';
import upload from '../middleware/multerConfig';
import isAuthenticated from '../middleware/isAuthMiddleware';
import { ProductController } from '../controllers/productController';
import { SearchController } from '../controllers/productSearch';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware';
import uploads from '../middleware/multer';
import cloudinary from '../helps/cloudinaryConfig';
import checkPermission from '../middleware/checkPermissionMiddleware';
import productRecommend from '../controllers/productRecommend';
const router = express.Router();
router.get('/available', ProductController.getAvailableProduct);
router.post('/recommend', productRecommend);
router.get('/:id', ProductController.getSingleProduct);
router.get('/:searchKeyword', SearchController.search, getProducts);
router.get(
  '/mine/:id',
  isAuthenticated,
  checkPermission('seller'),
  ProductController.getAllFromMine,
);
router.post(
  '/remove-image',
  isAuthenticated,
  checkPermission('seller'),
  ProductController.removeProductImage,
);
router.post('/', isAuthenticated, checkPermission('seller'), createCollection);
router.get(
  '/collections/list',
  isAuthenticated,
  checkPermission('seller'),
  getUserCollections,
);
router.post(
  '/:collectionId',
  isAuthenticated,
  checkPermission('seller'),
  upload.array('images'),
  createProduct,
);

router.get('/', isAuthenticated, checkPermission('admin'), getProducts);

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
  '/:collectionId',
  isAuthenticated,
  checkPermission('seller'),
  upload.array('images'),
  createProduct,
);
router.delete('/:id', isAuthenticated, ProductController.deleteProduct);
router.get(
  '/:collectionid/products',
  isAuthenticated,
  checkPermission('seller'),
  getProductsPerCollection,
);
router.delete(
  '/collection/:collectionid',
  isAuthenticated,
  checkPermission('seller'),
  deleteCollection,
);

export default router;
