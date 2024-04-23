import express from "express";
import  UserController  from "../controllers/userControllers";

const router = express.Router();

router.get('/', UserController.getUsers);
router.post('/', UserController.registerUser);

//get user by id
router.get('/:id', UserController.getSingleUser)
// updating user Profile
router.patch('/editUser/:id',UserController.updateSingleUser)

export default router;
