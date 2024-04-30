import express from "express";
import { handlePasswordResetRequest, resetPassword } from '../controllers/userControllers';

const router = express.Router();

router.post('/forgot-password', handlePasswordResetRequest);
router.post('/reset-password', resetPassword);

export default router;
