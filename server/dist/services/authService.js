"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("./userService");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-access-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-jwt-refresh-secret";
class AuthService {
    static async verifyAndExtractGoogleUser(credential, mockUser) {
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
            }
            catch (verifyError) {
                // Fallback for custom JWT decode or dev token verification
                const decoded = jsonwebtoken_1.default.decode(credential);
                if (decoded?.sub) {
                    return {
                        googleId: decoded.sub,
                        email: decoded.email || "",
                        name: decoded.name || "Google User",
                        avatarUrl: decoded.picture || "",
                    };
                }
                else if (process.env.NODE_ENV !== "production") {
                    return {
                        googleId: "google-dev-user-id-123",
                        email: "user@example.com",
                        name: "Demo Finance User",
                        avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c",
                    };
                }
                else {
                    throw new Error("Invalid Google ID token credential");
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
        throw new Error("Google credential is required for authentication");
    }
    static generateTokens(userPayload) {
        const accessToken = jsonwebtoken_1.default.sign(userPayload, JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign(userPayload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
        return { accessToken, refreshToken };
    }
    static async authenticateGoogleUser(credential, mockUser) {
        const extractedUser = await this.verifyAndExtractGoogleUser(credential, mockUser);
        const user = await userService_1.UserService.findOrCreateUser(extractedUser);
        const tokens = this.generateTokens(user);
        await userService_1.UserService.updateRefreshToken(user.id, user.googleId, tokens.refreshToken);
        return { user, tokens };
    }
    static async refreshSession(existingRefreshToken) {
        if (!existingRefreshToken) {
            throw new Error("Refresh token missing");
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(existingRefreshToken, JWT_REFRESH_SECRET);
        }
        catch {
            throw new Error("Invalid or expired refresh token");
        }
        const userPayload = {
            id: decoded.id,
            googleId: decoded.googleId,
            email: decoded.email,
            name: decoded.name,
            avatarUrl: decoded.avatarUrl,
        };
        const tokens = this.generateTokens(userPayload);
        await userService_1.UserService.updateRefreshToken(userPayload.id, userPayload.googleId, tokens.refreshToken);
        return { user: userPayload, tokens };
    }
    static async revokeSession(refreshTokenValue) {
        if (!refreshTokenValue)
            return;
        try {
            const decoded = jsonwebtoken_1.default.decode(refreshTokenValue);
            if (decoded?.id && decoded?.googleId) {
                await userService_1.UserService.updateRefreshToken(decoded.id, decoded.googleId, undefined);
            }
        }
        catch {
            // Ignore decoding errors during logout
        }
    }
}
exports.AuthService = AuthService;
