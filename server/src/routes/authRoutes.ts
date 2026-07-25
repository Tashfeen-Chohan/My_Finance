import { Router } from "express";
import { googleLogin, refreshToken, logout, getMe } from "../controllers/authController";
import { authenticateJwt } from "../middleware/authMiddleware";

const router = Router();

router.post("/google", googleLogin);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", authenticateJwt, getMe);

export default router;
