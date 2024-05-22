import express from 'express';
import UserController from '../controllers/userControllers';
import {
  handlePasswordResetRequest,
  resetPassword,
} from '../controllers/userControllers';
import { validations } from '../validations/validations';
import authMiddleWares from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', UserController.getUsers);
router.post('/registerUser', UserController.registerUser);
router.post('/isVerified/:token', UserController.isVerified);
router.post('/login', UserController.login);
router.post('/forgot-password', handlePasswordResetRequest);
router.post('/reset-password', resetPassword);
router.put(
  '/changepassword',
  validations.validateUpdatePassword,
  authMiddleWares.isAuthenticated,
  UserController.updatePassword,
);

export default router;
