import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

export interface AuthenticatedUser {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateJwt = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

    // Prioritize Authorization header for SPA client requests
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Fallback to HTTP-only cookie if no Bearer header token is present
    if (!token && (req.cookies?.token || req.cookies?.accessToken)) {
      token = req.cookies.token || req.cookies.accessToken;
    }

    if (!token) {
      res.status(401).json({ success: false, error: "Access token missing" });
      return;
    }

    const secret = process.env.JWT_SECRET || "dev-jwt-access-secret";

    const decoded = jwt.verify(token, secret) as AuthenticatedUser;
    req.user = decoded;
    return next();
  } catch (error) {
    if ((error as Error)?.name === "TokenExpiredError") {
      logger.warn(`[Auth] Token expired for request ${req.method} ${req.originalUrl}`);
    } else {
      logger.warn(`[Auth] Invalid token for request ${req.method} ${req.originalUrl}: ${(error as Error)?.message || error}`);
    }
    res.status(401).json({ success: false, error: "Invalid or expired access token" });
  }
};
