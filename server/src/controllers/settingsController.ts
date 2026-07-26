import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { getUserSettings, updateUserSettings } from "../services/settingsService";
import { UnauthorizedError } from "../errors/ApiError";

export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const settings = await getUserSettings(req.user.id);
  res.json({ success: true, data: settings });
};

export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const updated = await updateUserSettings(req.user.id, req.body);
  res.json({ success: true, data: updated });
};
