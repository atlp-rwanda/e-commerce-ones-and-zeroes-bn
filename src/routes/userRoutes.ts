import express from "express";
import  UserController  from "../controllers/userControllers";
import AuthMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.get('/', UserController.getUsers);
router.post('/registerUser', UserController.registerUser);
router.post('/loginUser',UserController.loginUser)
router.put('/setUserRole/:id',AuthMiddleware.isAuthenticated,AuthMiddleware.checkRole,UserController.setUserRoles)

export default router;
