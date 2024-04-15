import express, { Router, Request, Response } from 'express';
import examplesRoute from './exampleRoutes';
import passport from '../Auth/google.auth';
import { db } from '../database/models';
import UserController from '../controllers/userControllers';

const isValidated = (req: any, res: any, next: () => void) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

const router: Router = express.Router();

router.get('/', UserController.loginUserPage);
router.get('/google', async (req: any, res: any) => {
  await passport.authenticate('google', { scope: ['profile', 'email'] });
}); // UserController.googleAuth
router.get('/google/callback', UserController.googleAuthCallback);
router.get('/google/register', isValidated, UserController.registerUserGoogle);

router.get('/protected', isValidated, (req: any, res: any) => {
  res.status(200).send('User signed is as: ');
});

router.use('/examples', examplesRoute);

export default router;
