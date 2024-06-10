import express from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import userRoute from './userRoutes';
import productsRoutes from './productRoutes';
import wishlistRoutes from './wishlistRoute';
import cartRoute from '../routes/cartRoutes';
import chatRoutes from '../routes/chatsRoutes';
import productReview from './productReviewRoutes';
import addressRoute from './addressRoute';
import orderRoute from './orderRoute';
const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to OnesAnd Ecommerce website');
});

router.use('/users', userRoute);
router.use('/products', productsRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/carts', cartRoute);
router.use('/chats', chatRoutes);
router.use('/addresses', addressRoute);
router.use('/orders', orderRoute);

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

router.use('/product', productReview);
router.use('/products', productsRoutes);

export default router;
