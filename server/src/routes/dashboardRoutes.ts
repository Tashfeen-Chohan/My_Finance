import { Router } from "express";
import {
  getDashboardStats,
  getDashboardRecentActivity,
  getDashboardUpcomingReminders,
  getDashboardSummary,
} from "../controllers/dashboardController";
import { authenticateJwt } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.use(authenticateJwt);

router.get("/stats", asyncHandler(getDashboardStats));
router.get("/recent-activity", asyncHandler(getDashboardRecentActivity));
router.get("/upcoming-reminders", asyncHandler(getDashboardUpcomingReminders));
router.get("/summary", asyncHandler(getDashboardSummary));

export default router;
