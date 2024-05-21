import express, { Router } from 'express';
import UserController from '../controllers/userControllers';
import {
  handlePasswordResetRequest,
  resetPassword,
} from '../controllers/userControllers';
import authMiddleware from '../middleware/authMiddleware';

const router: Router = express.Router();

router.get('/', UserController.getUsers);
router.post('/registerUser', UserController.registerUser);
router.post('/isVerified/:token', UserController.isVerified);
router.post('/login', UserController.login);
router.post('/forgot-password', handlePasswordResetRequest);
router.post('/reset-password', resetPassword);

router.put(
  '/disable/:id',
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole,
  UserController.disableUser,
);

export default router;
