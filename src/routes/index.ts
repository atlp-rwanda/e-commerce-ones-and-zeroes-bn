import express, { Router, Request, Response } from 'express';
import examplesRoute from './exampleRoutes';
import { db } from '../database/models/index';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to OnesAnd Ecommerce website');
});

router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await db.User.findAll();
    console.log(users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.use('/examples', examplesRoute);

export default router;
