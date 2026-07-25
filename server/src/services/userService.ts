import { User, IUser } from "../models/User";

export interface UserDTO {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

// In-memory fallback for local dev when MongoDB is not connected
const inMemoryUsers = new Map<
  string,
  { id: string; googleId: string; email: string; name: string; avatarUrl?: string; refreshToken?: string }
>();

const isMongoConnected = (): boolean => {
  return User.db.readyState === 1;
};

export class UserService {
  public static async findOrCreateUser(userData: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }): Promise<UserDTO> {
    const { googleId, email, name, avatarUrl } = userData;

    if (isMongoConnected()) {
      let dbUser = await User.findOne({ $or: [{ googleId }, { email }] });
      if (!dbUser) {
        dbUser = await User.create({ googleId, email, name, avatarUrl });
      } else {
        dbUser.name = name;
        if (avatarUrl) dbUser.avatarUrl = avatarUrl;
        await dbUser.save();
      }

      return {
        id: dbUser._id.toString(),
        googleId: dbUser.googleId,
        email: dbUser.email,
        name: dbUser.name,
        avatarUrl: dbUser.avatarUrl,
      };
    } else {
      let memoryUser = inMemoryUsers.get(googleId);
      if (!memoryUser) {
        const id = "user_" + Math.random().toString(36).substring(2, 9);
        memoryUser = { id, googleId, email, name, avatarUrl };
      } else {
        memoryUser.name = name;
        if (avatarUrl) memoryUser.avatarUrl = avatarUrl;
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

  public static async updateRefreshToken(userId: string, googleId: string, refreshToken?: string): Promise<void> {
    if (isMongoConnected()) {
      if (refreshToken) {
        await User.findByIdAndUpdate(userId, { refreshToken });
      } else {
        await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
      }
    } else {
      const memoryUser = inMemoryUsers.get(googleId);
      if (memoryUser) {
        memoryUser.refreshToken = refreshToken;
      }
    }
  }

  public static async findById(id: string): Promise<UserDTO | null> {
    if (isMongoConnected()) {
      const dbUser = await User.findById(id);
      if (!dbUser) return null;
      return {
        id: dbUser._id.toString(),
        googleId: dbUser.googleId,
        email: dbUser.email,
        name: dbUser.name,
        avatarUrl: dbUser.avatarUrl,
      };
    } else {
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
