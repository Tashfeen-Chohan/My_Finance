import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { SettingsService } from "../services/settingsService";
import { UnauthorizedError } from "../errors/ApiError";

export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const settings = await SettingsService.getUserSettings(req.user.id);
  res.json({ success: true, data: settings });
};

export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const updated = await SettingsService.updateUserSettings(req.user.id, req.body);
  res.json({ success: true, data: updated });
};
