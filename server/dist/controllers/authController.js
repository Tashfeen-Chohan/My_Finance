"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.refreshToken = exports.googleLogin = void 0;
const authService_1 = require("../services/authService");
const setAuthCookies = (res, accessToken, refreshToken) => {
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
const googleLogin = async (req, res) => {
    try {
        const { credential, mockUser } = req.body;
        const { user, tokens } = await authService_1.AuthService.authenticateGoogleUser(credential, mockUser);
        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
        res.json({
            success: true,
            user,
            accessToken: tokens.accessToken,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Google authentication failed";
        res.status(400).json({ success: false, error: message });
    }
};
exports.googleLogin = googleLogin;
const refreshToken = async (req, res) => {
    try {
        const existingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
        const { user, tokens } = await authService_1.AuthService.refreshSession(existingRefreshToken);
        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
        res.json({
            success: true,
            user,
            accessToken: tokens.accessToken,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Token refresh failed";
        res.status(401).json({ success: false, error: message });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        const refreshTokenVal = req.cookies?.refreshToken;
        await authService_1.AuthService.revokeSession(refreshTokenVal);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Logout failed";
        res.status(500).json({ success: false, error: message });
    }
};
exports.logout = logout;
const getMe = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ success: false, error: "Not authenticated" });
        return;
    }
    res.json({ success: true, user: req.user });
};
exports.getMe = getMe;
