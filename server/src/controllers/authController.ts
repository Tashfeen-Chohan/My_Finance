import { Response } from "express";
import { AuthService } from "../services/authService";
import { AuthRequest } from "../middleware/authMiddleware";

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const googleLogin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { credential, mockUser } = req.body;
    const { user, tokens } = await AuthService.authenticateGoogleUser(credential, mockUser);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res.json({
      success: true,
      user,
      accessToken: tokens.accessToken,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Google authentication failed";
    res.status(400).json({ success: false, error: message });
  }
};

export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const { user, tokens } = await AuthService.refreshSession(existingRefreshToken);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res.json({
      success: true,
      user,
      accessToken: tokens.accessToken,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Token refresh failed";
    res.status(401).json({ success: false, error: message });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const refreshTokenVal = req.cookies?.refreshToken;
    await AuthService.revokeSession(refreshTokenVal);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Logout failed";
    res.status(500).json({ success: false, error: message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: "Not authenticated" });
    return;
  }
  res.json({ success: true, user: req.user });
};
