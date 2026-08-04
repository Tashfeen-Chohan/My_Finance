import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { getUserPreferences, updateUserPreferences } from "../services/preferenceService";
import { UnauthorizedError } from "../errors/ApiError";

export const getPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const preferences = await getUserPreferences(req.user.id);
  res.json({ success: true, data: preferences });
};

export const updatePreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw UnauthorizedError();
  const updated = await updateUserPreferences(req.user.id, req.body);
  res.json({ success: true, data: updated });
};
