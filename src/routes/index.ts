import express, { Router, Request, Response } from 'express';
import userRoute from '../routes/userRoutes';
import examplesRoute from './exampleRoutes';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to OnesAnd Ecommerce website');
});

router.use('/users', userRoute);
router.use('/examples', examplesRoute);

export default router;
