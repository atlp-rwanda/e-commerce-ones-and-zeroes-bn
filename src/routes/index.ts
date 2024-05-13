import express from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import userRoute from './userRoutes';
import updateUserRoutes from './updateUserRoutes';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to OnesAnd Ecommerce website');
});

// Use userRoute for paths starting with '/users'
router.use('/users', userRoute);
router.use('/users', updateUserRoutes);

// Error handling middleware
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default router;
