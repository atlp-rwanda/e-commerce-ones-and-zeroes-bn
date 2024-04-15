import express from "express";
import { getUsers } from "../controllers/userControllers";

const router = express.Router();
router.get('/', getUsers);

export default router;