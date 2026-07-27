import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      res.status(401).json({ success: false, error: "Access token missing" });
      return;
    }

    const secret = process.env.JWT_SECRET || "dev-jwt-access-secret";

    try {
      const decoded = jwt.verify(token, secret) as AuthenticatedUser;
      req.user = decoded;
      return next();
    } catch (primaryErr) {
      // If primary token failed (e.g. stale cookie) but a secondary token exists, try fallback
      const fallbackToken =
        token === req.cookies?.accessToken
          ? req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : undefined
          : req.cookies?.accessToken;

      if (fallbackToken) {
        const decodedFallback = jwt.verify(fallbackToken, secret) as AuthenticatedUser;
        req.user = decodedFallback;
        return next();
      }
      throw primaryErr;
    }
  } catch (error) {
    console.log("Invalid or expired access token: ", error);
    res.status(401).json({ success: false, error: "Invalid or expired access token" });
  }
};
