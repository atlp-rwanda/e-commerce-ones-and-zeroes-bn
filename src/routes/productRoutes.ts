import express from 'express';
import ProductController from '../controllers/productController';
// import uploadMiddleware from '../middleware/multer'

const productRouter = express.Router();

productRouter.get('/', ProductController.getAllProducts);
productRouter.get('/:id', ProductController.getSingleProduct);
productRouter.patch('/:id', ProductController.updateProduct);
productRouter.post('/remove-image', ProductController.removeProductImage);
// productRouter.post('/upload', uploadMiddleware, ProductController.uploadMultipleImages)

export default productRouter;
