import express from 'express';
import UserController from '../controllers/userControllers';

const router = express.Router();

router.post('/registerUser', UserController.registerUser);

export default router;
