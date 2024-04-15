import express from 'express';
import UserController from '../controllers/userControllers';

const router = express.Router();

router.get('/', UserController.getUsers);
router.post('/registerUser', UserController.registerUser);
router.post('/isVerified/:token', UserController.isVerified);
router.post('/login', UserController.login);

export default router;
