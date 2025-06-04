import { Router } from "express";
import { authController } from "../controllers/authController";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/dashboard", authMiddleware, authController.getDashboardData);

export default router;
