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
router.post('/reset-password/:token', resetPassword);

router.put(
  '/disable/:id',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole('admin'),
  UserController.disableUser,
);
router.get(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole('admin'),
  UserController.getUsers,
);
router.get(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  UserController.getSingleUser,
);
router.patch(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.isAuthenticated,
  UserController.updateSingleUser,
);

export default router;
