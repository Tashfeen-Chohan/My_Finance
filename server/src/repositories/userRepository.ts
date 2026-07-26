import { BaseRepository } from "./baseRepository";
import { User, IUser } from "../models/User";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return await this.findOne({ googleId });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email: email.toLowerCase() });
  }

  async updateRefreshToken(userId: string, refreshToken?: string): Promise<void> {
    await User.updateOne({ _id: userId }, { $set: { refreshToken } });
  }
}

export const userRepository = new UserRepository();
