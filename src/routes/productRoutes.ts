import express from 'express';
import ProductController from '../controllers/productController';
// import uploadMiddleware from '../middleware/multer'
import multer from 'multer';


const productRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/documents");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

productRouter.post(
  "/register",
  upload.single("file"),
);
productRouter.get('/', ProductController.getAllProducts);
productRouter.get('/:id', ProductController.getSingleProduct);
productRouter.patch('/update/:id', ProductController.updateProduct);
productRouter.put('/upload/:id',upload.single("file"),ProductController.updateImage)
productRouter.post('/remove-image', ProductController.removeProductImage);
// productRouter.post('/upload', uploadMiddleware, ProductController.uploadMultipleImages)

export default productRouter;
