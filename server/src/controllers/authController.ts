import { Response } from "express";
import { authenticateGoogleUser, refreshSession, revokeSession } from "../services/authService";
import { AuthRequest } from "../middleware/authMiddleware";

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    partitioned: isProd ? true : undefined,
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  } as any);

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  } as any);
};

export const googleLogin = async (req: AuthRequest, res: Response): Promise<void> => {
  const { credential, mockUser } = req.body;
  const { user, tokens } = await authenticateGoogleUser(credential, mockUser);

  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  res.json({
    success: true,
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  const existingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const { user, tokens } = await refreshSession(existingRefreshToken);

  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  res.json({
    success: true,
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
  const refreshTokenVal = req.cookies?.refreshToken || req.body?.refreshToken;
  await revokeSession(refreshTokenVal);

  const clearOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    partitioned: isProd ? true : undefined,
  };

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

