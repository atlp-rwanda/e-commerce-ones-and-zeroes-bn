import express from "express";
import  UserController  from "../controllers/userControllers";

const router = express.Router();

router.get('/', UserController.getUsers);
router.post('/', UserController.registerUser);

export default router;
