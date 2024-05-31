import express from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import userRoute from './userRoutes';
import productsRoutes from './productRoutes';
import wishlistRoutes from './wishlistRoute';
import cartRoute from '../routes/cartRoutes';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to OnesAnd Ecommerce website');
});

router.use('/users', userRoute);
router.use('/products', productsRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/carts', cartRoute);

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default router;
