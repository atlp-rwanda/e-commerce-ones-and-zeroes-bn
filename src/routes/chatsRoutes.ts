import express from 'express';
import path from 'path';
import { findChats } from '../controllers/chatController';
import isAuthenticated from '../middleware/isAuthMiddleware';

const router = express.Router();
router.get('/', findChats);

export default router;
