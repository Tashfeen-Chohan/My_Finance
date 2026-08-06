import { createBaseRepository } from "./baseRepository";
import { User, IUser } from "../models/User";

const baseRepo = createBaseRepository<IUser>(User);

export const userRepository = {
  ...baseRepo,

  findByGoogleIdOrEmail: async (googleId: string, email: string): Promise<IUser | null> => {
    const cleanEmail = email.toLowerCase().trim();
    // Query direct Mongoose User model to find any matching user regardless of soft-delete state
    return await User.findOne({
      $or: [{ googleId: googleId.trim() }, { email: cleanEmail }],
    });
  },

  findByGoogleId: async (googleId: string): Promise<IUser | null> => {
    return await User.findOne({ googleId: googleId.trim() });
  },

  findByEmail: async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email: email.toLowerCase().trim() });
  },
};
