import express from 'express';
import {
  createCollection,
  createProduct,
  getProducts,
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
router.post('/recommend', productRecommend)
router.get(
  '/:id',
  ProductController.getSingleProduct,
);
router.get(
  '/:searchKeyword',
  SearchController.search,
  getProducts,
);
router.post('/', isAuthenticated, checkPermission('seller'), createCollection);

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
  '/remove-image',
  isAuthenticated,
  checkPermission('seller'),
  ProductController.removeProductImage,
);
router.post(
  '/:collectionId',
  isAuthenticated,
  checkPermission('seller'),
  upload.array('images'),
  createProduct,
);


router.delete('/:id', isAuthenticated, ProductController.deleteProduct);

export default router;
