import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboardController";
import { authenticateJwt } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.use(authenticateJwt);

router.get("/summary", asyncHandler(getDashboardSummary));

export default router;
