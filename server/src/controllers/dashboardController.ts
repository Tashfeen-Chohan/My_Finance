import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { DashboardService } from "../services/dashboardService";
import { UnauthorizedError } from "../errors/ApiError";

export const getDashboardSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const summary = await DashboardService.getSummary(req.user.id);
  res.json({ success: true, data: summary });
};
