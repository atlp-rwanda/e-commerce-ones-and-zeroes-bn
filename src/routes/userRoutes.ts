import express from 'express';
import UserController from '../controllers/userControllers';

const router = express.Router();

router.post('/registerUser', UserController.registerUser);
router.post('/login', UserController.login);

export default router;
