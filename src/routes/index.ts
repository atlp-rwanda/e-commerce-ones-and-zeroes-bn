import express, { Router, Request, Response } from "express";
import examplesRoute from "./exampleRoutes";
import {
  handlePasswordResetRequest,
  resetPassword,
} from "../controllers/userControllers";

const router: Router = express.Router();

router.post("/forgot-password", handlePasswordResetRequest);
router.post("/reset-password", resetPassword);
router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to OnesAnd Ecommerce website");
});

router.use("/examples", examplesRoute);

export default router;
