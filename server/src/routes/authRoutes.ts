import { Router } from "express";
import { googleLogin, refreshToken, logout, getMe } from "../controllers/authController";
import { authenticateJwt } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateRequest } from "../middleware/validateRequest";
import { googleLoginSchema } from "../validations/authValidation";

const router = Router();

router.post("/google", validateRequest(googleLoginSchema), asyncHandler(googleLogin));
router.post("/refresh", asyncHandler(refreshToken));
router.post("/logout", asyncHandler(logout));
router.get("/me", authenticateJwt, asyncHandler(getMe));

export default router;
