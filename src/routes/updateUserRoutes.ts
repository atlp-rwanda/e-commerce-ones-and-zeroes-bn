import express from 'express';
import UserController from '../controllers/userControllers';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

export default router;
