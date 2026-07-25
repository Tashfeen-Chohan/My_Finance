"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJwt = (req, res, next) => {
    try {
        let token = req.cookies?.accessToken;
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            res.status(401).json({ success: false, error: "Access token missing" });
            return;
        }
        const secret = process.env.JWT_SECRET || "default-secret-key";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, error: "Invalid or expired access token" });
    }
};
exports.authenticateJwt = authenticateJwt;
