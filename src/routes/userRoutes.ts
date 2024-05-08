import express from "express";
import  UserController  from "../controllers/userControllers";
import  loginController  from "../controllers/loginController";
import AuthMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.get('/', UserController.getUsers);
router.post('/registerUser', UserController.registerUser);
router.post('/loginUser',loginController.login)
router.put('/setUserRole/:id',AuthMiddleware.isAuthenticated,AuthMiddleware.checkRole,UserController.setUserRoles)
router.post('/2fa-verify',loginController.twoFAController)
router.post('/toggle-2fa', loginController.toggle2FA)

export default router;










