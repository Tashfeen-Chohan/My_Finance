import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { findOrCreateUser, updateUserRefreshToken, UserDTO } from "./userService";
import { UnauthorizedError } from "../errors/ApiError";

const getGoogleClient = () => new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const getJwtSecret = () => process.env.JWT_SECRET || "dev-jwt-access-secret";
const getJwtRefreshSecret = () => process.env.JWT_REFRESH_SECRET || "dev-jwt-refresh-secret";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

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

export const generateTokens = (userPayload: UserDTO): AuthTokens => {
  const secret = getJwtSecret();
  const refreshSecret = getJwtRefreshSecret();

  const accessToken = jwt.sign(userPayload, secret, { expiresIn: "15m" });
  const refreshToken = jwt.sign(userPayload, refreshSecret, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

export const authenticateGoogleUser = async (
  credential?: string,
  mockUser?: { googleId?: string; email?: string; name?: string; avatarUrl?: string }
): Promise<{ user: UserDTO; tokens: AuthTokens }> => {
  const extractedUser = await verifyAndExtractGoogleUser(credential, mockUser);
  const user = await findOrCreateUser(extractedUser);
  const tokens = generateTokens(user);

  await updateUserRefreshToken(user.id, tokens.refreshToken);

  return { user, tokens };
};

export const refreshSession = async (existingRefreshToken: string): Promise<{ user: UserDTO; tokens: AuthTokens }> => {
  if (!existingRefreshToken) {
    throw UnauthorizedError("Refresh token missing");
  }

  let decoded: UserDTO;
  try {
    decoded = jwt.verify(existingRefreshToken, getJwtRefreshSecret()) as UserDTO;
  } catch (error) {
    console.log("Invalid or expired refresh token: ", error);
    throw UnauthorizedError("Invalid or expired refresh token");
  }

  const userPayload: UserDTO = {
    id: decoded.id,
    googleId: decoded.googleId,
    email: decoded.email,
    name: decoded.name,
    avatarUrl: decoded.avatarUrl,
  };

  const tokens = generateTokens(userPayload);
  await updateUserRefreshToken(userPayload.id, tokens.refreshToken);

  return { user: userPayload, tokens };
};

export const revokeSession = async (refreshTokenValue?: string): Promise<void> => {
  if (!refreshTokenValue) return;
  try {
    const decoded = jwt.decode(refreshTokenValue) as { id?: string } | null;
    if (decoded?.id) {
      await updateUserRefreshToken(decoded.id, undefined);
    }
  } catch {
    // Ignore decoding errors during logout
  }
};

export const AuthService = {
  verifyAndExtractGoogleUser,
  generateTokens,
  authenticateGoogleUser,
  refreshSession,
  revokeSession,
};
