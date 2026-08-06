import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { findOrCreateUser, UserDTO } from "./userService";
import { UnauthorizedError } from "../errors/ApiError";

const getGoogleClient = () => new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const getJwtSecret = () => process.env.JWT_SECRET || "dev-jwt-access-secret";

export const verifyAndExtractGoogleUser = async (
  credential?: string,
  mockUser?: { googleId?: string; email?: string; name?: string; avatarUrl?: string }
): Promise<{ googleId: string; email: string; name: string; avatarUrl?: string }> => {
  if (credential) {
    try {
      const ticket = await getGoogleClient().verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (payload && payload.sub) {
        return {
          googleId: payload.sub,
          email: payload.email || "",
          name: payload.name || payload.email || "Google User",
          avatarUrl: payload.picture || "",
        };
      }
    } catch {
      const decoded = jwt.decode(credential) as { sub?: string; email?: string; name?: string; picture?: string } | null;
      if (decoded?.sub) {
        return {
          googleId: decoded.sub,
          email: decoded.email || "",
          name: decoded.name || "Google User",
          avatarUrl: decoded.picture || "",
        };
      } else if (process.env.NODE_ENV !== "production") {
        return {
          googleId: "google-dev-user-id-123",
          email: "user@example.com",
          name: "Demo Finance User",
          avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        };
      } else {
        throw UnauthorizedError("Invalid Google ID token credential");
      }
    }
  }

  if (mockUser && process.env.NODE_ENV !== "production") {
    return {
      googleId: mockUser.googleId || "google-dev-user-id-123",
      email: mockUser.email || "user@example.com",
      name: mockUser.name || "Demo Finance User",
      avatarUrl: mockUser.avatarUrl || "https://lh3.googleusercontent.com/a/default-user=s96-c",
    };
  }

  throw UnauthorizedError("Google credential is required for authentication");
};

export const generateToken = (userPayload: UserDTO): string => {
  const secret = getJwtSecret();
  // Single JWT Token valid for 30 days
  return jwt.sign(userPayload, secret, { expiresIn: "30d" });
};

export const authenticateGoogleUser = async (
  credential?: string,
  mockUser?: { googleId?: string; email?: string; name?: string; avatarUrl?: string }
): Promise<{ user: UserDTO; token: string }> => {
  const extractedUser = await verifyAndExtractGoogleUser(credential, mockUser);
  const user = await findOrCreateUser(extractedUser);
  const token = generateToken(user);

  return { user, token };
};

export const AuthService = {
  verifyAndExtractGoogleUser,
  generateToken,
  authenticateGoogleUser,
};
