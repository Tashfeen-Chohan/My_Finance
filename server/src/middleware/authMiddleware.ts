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
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({ success: false, error: "Access token missing" });
      return;
    }

    const secret = process.env.JWT_SECRET || "dev-jwt-access-secret";
    const decoded = jwt.verify(token, secret) as AuthenticatedUser;

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Invalid or expired access token: ", error);
    res.status(401).json({ success: false, error: "Invalid or expired access token" });
  }
};
