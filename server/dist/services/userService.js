"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../models/User");
// In-memory fallback for local dev when MongoDB is not connected
const inMemoryUsers = new Map();
const isMongoConnected = () => {
    return User_1.User.db.readyState === 1;
};
class UserService {
    static async findOrCreateUser(userData) {
        const { googleId, email, name, avatarUrl } = userData;
        if (isMongoConnected()) {
            let dbUser = await User_1.User.findOne({ $or: [{ googleId }, { email }] });
            if (!dbUser) {
                dbUser = await User_1.User.create({ googleId, email, name, avatarUrl });
            }
            else {
                dbUser.name = name;
                if (avatarUrl)
                    dbUser.avatarUrl = avatarUrl;
                await dbUser.save();
            }
            return {
                id: dbUser._id.toString(),
                googleId: dbUser.googleId,
                email: dbUser.email,
                name: dbUser.name,
                avatarUrl: dbUser.avatarUrl,
            };
        }
        else {
            let memoryUser = inMemoryUsers.get(googleId);
            if (!memoryUser) {
                const id = "user_" + Math.random().toString(36).substring(2, 9);
                memoryUser = { id, googleId, email, name, avatarUrl };
            }
            else {
                memoryUser.name = name;
                if (avatarUrl)
                    memoryUser.avatarUrl = avatarUrl;
            }
            inMemoryUsers.set(googleId, memoryUser);
            return {
                id: memoryUser.id,
                googleId: memoryUser.googleId,
                email: memoryUser.email,
                name: memoryUser.name,
                avatarUrl: memoryUser.avatarUrl,
            };
        }
    }
    static async updateRefreshToken(userId, googleId, refreshToken) {
        if (isMongoConnected()) {
            if (refreshToken) {
                await User_1.User.findByIdAndUpdate(userId, { refreshToken });
            }
            else {
                await User_1.User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
            }
        }
        else {
            const memoryUser = inMemoryUsers.get(googleId);
            if (memoryUser) {
                memoryUser.refreshToken = refreshToken;
            }
        }
    }
    static async findById(id) {
        if (isMongoConnected()) {
            const dbUser = await User_1.User.findById(id);
            if (!dbUser)
                return null;
            return {
                id: dbUser._id.toString(),
                googleId: dbUser.googleId,
                email: dbUser.email,
                name: dbUser.name,
                avatarUrl: dbUser.avatarUrl,
            };
        }
        else {
            for (const memoryUser of inMemoryUsers.values()) {
                if (memoryUser.id === id) {
                    return {
                        id: memoryUser.id,
                        googleId: memoryUser.googleId,
                        email: memoryUser.email,
                        name: memoryUser.name,
                        avatarUrl: memoryUser.avatarUrl,
                    };
                }
            }
            return null;
        }
    }
}
exports.UserService = UserService;
