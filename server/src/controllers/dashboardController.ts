import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  getDashboardStats as getDashboardStatsService,
  getDashboardRecentActivity as getDashboardRecentActivityService,
  getDashboardUpcomingReminders as getDashboardUpcomingRemindersService,
  getDashboardMonthlyComparison as getDashboardMonthlyComparisonService,
} from "../services/dashboardService";
import { UnauthorizedError } from "../errors/ApiError";

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const vehicleId = String(req.query.vehicleId || "");
  const data = await getDashboardStatsService(req.user.id, vehicleId);
  res.json({ success: true, data });
};

export const getDashboardRecentActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const vehicleId = String(req.query.vehicleId || "");
  const data = await getDashboardRecentActivityService(req.user.id, vehicleId);
  res.json({ success: true, data });
};

export const getDashboardUpcomingReminders = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const vehicleId = String(req.query.vehicleId || "");
  const data = await getDashboardUpcomingRemindersService(req.user.id, vehicleId);
  res.json({ success: true, data });
};

export const getDashboardMonthlyComparison = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const vehicleId = String(req.query.vehicleId || "");
  const data = await getDashboardMonthlyComparisonService(req.user.id, vehicleId);
  res.json({ success: true, data });
};
