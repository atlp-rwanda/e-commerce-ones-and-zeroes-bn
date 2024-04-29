import { Router } from "express";
import userControllers from "../controllers/userControllers";
import authMiddleWares from "../middleware/authMiddleware";
import validations from "../validations/validations";

const userRoutes = Router()

userRoutes.get("/users",authMiddleWares.isAuthenticated,userControllers.getUsers)
userRoutes.put("/users/:id",userControllers.editUsers)
userRoutes.get("/users/:id",userControllers.getUserById)
userRoutes.post("/users",userControllers.addUser)
userRoutes.post("/login", userControllers.login)
userRoutes.put("/user/changepassword",validations.validateUpdatePassword,authMiddleWares.isAuthenticated, userControllers.updatePassword)
export default userRoutes