import express, { Router, Request, Response } from 'express';
import examplesRoute from './exampleRoutes';
import passport from '../Auth/google.auth';
import { db } from '../database/models';
import { authenticateToken } from '../Auth/jwt.tokens';
import UserController from '../controllers/userControllers';
const router: Router = express.Router();

router.get('/profile', authenticateToken, (req: any, res: any) => {
  const userDetails = req.user;
  return res.status(200).json({ message: 'User Profile', userDetails });
});

router.use('/examples', examplesRoute);

export default router;
