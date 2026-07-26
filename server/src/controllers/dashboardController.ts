import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { getDashboardSummary as getDashboardSummaryService } from "../services/dashboardService";
import { UnauthorizedError } from "../errors/ApiError";

export const getDashboardSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const summary = await getDashboardSummaryService(req.user.id);
  res.json({ success: true, data: summary });
};
