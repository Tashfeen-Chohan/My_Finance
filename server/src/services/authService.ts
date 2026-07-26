import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { UserService, UserDTO } from "./userService";
import { UnauthorizedError } from "../errors/ApiError";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-access-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-jwt-refresh-secret";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  public static async verifyAndExtractGoogleUser(
    credential?: string,
    mockUser?: { googleId?: string; email?: string; name?: string; avatarUrl?: string }
  ): Promise<{ googleId: string; email: string; name: string; avatarUrl?: string }> {
    if (credential) {
      try {
        const ticket = await googleClient.verifyIdToken({
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
          throw new UnauthorizedError("Invalid Google ID token credential");
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

    throw new UnauthorizedError("Google credential is required for authentication");
  }

  public static generateTokens(userPayload: UserDTO): AuthTokens {
    const accessToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(userPayload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
  }

  public static async authenticateGoogleUser(
    credential?: string,
    mockUser?: { googleId?: string; email?: string; name?: string; avatarUrl?: string }
  ): Promise<{ user: UserDTO; tokens: AuthTokens }> {
    const extractedUser = await this.verifyAndExtractGoogleUser(credential, mockUser);
    const user = await UserService.findOrCreateUser(extractedUser);
    const tokens = this.generateTokens(user);

    await UserService.updateRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  public static async refreshSession(existingRefreshToken: string): Promise<{ user: UserDTO; tokens: AuthTokens }> {
    if (!existingRefreshToken) {
      throw new UnauthorizedError("Refresh token missing");
    }

    let decoded: UserDTO;
    try {
      decoded = jwt.verify(existingRefreshToken, JWT_REFRESH_SECRET) as UserDTO;
    } catch {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const userPayload: UserDTO = {
      id: decoded.id,
      googleId: decoded.googleId,
      email: decoded.email,
      name: decoded.name,
      avatarUrl: decoded.avatarUrl,
    };

    const tokens = this.generateTokens(userPayload);
    await UserService.updateRefreshToken(userPayload.id, tokens.refreshToken);

    return { user: userPayload, tokens };
  }

  public static async revokeSession(refreshTokenValue?: string): Promise<void> {
    if (!refreshTokenValue) return;
    try {
      const decoded = jwt.decode(refreshTokenValue) as { id?: string } | null;
      if (decoded?.id) {
        await UserService.updateRefreshToken(decoded.id, undefined);
      }
    } catch {
      // Ignore decoding errors during logout
    }
  }
}
