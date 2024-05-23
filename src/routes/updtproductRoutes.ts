import express from 'express';
import ProductController from '../controllers/updtproductController';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware';
import upload from '../middleware/multer';
import cloudinary from '../helps/cloudinaryConfig';

const productRouter = express.Router();

productRouter.get(
  '/',

  ProductController.getAllProducts,
);
productRouter.get('/:id', ProductController.getSingleProduct);

productRouter.put(
  '/:id',
  // authMiddleware.isAuthenticated,
  // authMiddleware.checkSellerRole,
  upload.array('images'),
  ProductController.updateProduct,
);
productRouter.post(
  '/remove-image',
  authMiddleware.isAuthenticated,
  authMiddleware.checkSellerRole,
  ProductController.removeProductImage,
);

export default productRouter;
