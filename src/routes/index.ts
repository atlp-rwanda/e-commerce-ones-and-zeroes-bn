
import express, { Router, Request, Response } from 'express';
import userRoute from '../routes/userRoutes';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to OnesAnd Ecommerce website');
});


router.use('/users', userRoute);


export default router;
