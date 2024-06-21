import express, { Router, Request, Response } from 'express';
import { db } from '../database/models';
import UserController from '../controllers/userControllers';
import passport from '../config/google.auth';
const isValidated = (req: any, res: any, next: () => void) => {
  if (req.body) {
    next();
  } else {
    res.sendStatus(406);
  }
};

const router: Router = express.Router();

router.get('/', UserController.loginUserPage);
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth' }),
  function (req: any, res: any) {
    res.redirect('/auth/google/register');
  },
);
router.post('/google/register', UserController.registerUserGoogle);

router.get('/protected', isValidated, (req: any, res: any) => {
  res.status(200).send('User signed is as: ');
});

export default router;
