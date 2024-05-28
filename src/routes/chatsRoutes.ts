import express from 'express';
import path from 'path';
import { findChats, addChat } from '../controllers/chatController';
import isAuthenticated from '../middleware/isAuthMiddleware';

const router = express.Router();
router.get('/', async (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

router.get('/', isAuthenticated, findChats);
router.post('/', isAuthenticated, addChat);

export default router;
