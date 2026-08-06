import { Response } from "express";
import { authenticateGoogleUser } from "../services/authService";
import { AuthRequest } from "../middleware/authMiddleware";

const setAuthCookie = (res: Response, token: string): void => {
  const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    partitioned: isProd ? true : undefined,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  } as any);
};

export const googleLogin = async (req: AuthRequest, res: Response): Promise<void> => {
  const { credential, mockUser } = req.body;
  const { user, token } = await authenticateGoogleUser(credential, mockUser);

  setAuthCookie(res, token);

  res.json({
    success: true,
    user,
    token,
    accessToken: token, // Backward compatibility for clients expecting accessToken
  });
};

export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

  const clearOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    partitioned: isProd ? true : undefined,
  };

  res.clearCookie("token", clearOptions as any);
  res.clearCookie("accessToken", clearOptions as any);
  res.clearCookie("refreshToken", clearOptions as any);

  res.json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: "Not authenticated" });
    return;
  }
  res.json({ success: true, user: req.user });
};
