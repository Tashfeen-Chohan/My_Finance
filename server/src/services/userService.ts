import { userRepository } from "../repositories/userRepository";
import { IUser } from "../models/User";
import { NotFoundError } from "../errors/ApiError";

export interface UserDTO {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export class UserService {
  public static async findOrCreateUser(userData: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }): Promise<UserDTO> {
    const { googleId, email, name, avatarUrl } = userData;

    let user = await userRepository.findByGoogleId(googleId);
    if (!user) {
      user = await userRepository.findByEmail(email);
    }

    if (!user) {
      user = await userRepository.create({
        googleId,
        email,
        name,
        avatarUrl,
        preferences: {
          currency: "PKR",
          distanceUnit: "km",
          fuelUnit: "liters",
          theme: "system",
        },
      });
    } else {
      user.name = name;
      if (avatarUrl) user.avatarUrl = avatarUrl;
      await user.save();
    }

    return this.mapToDTO(user);
  }

  public static async getUserById(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User profile not found");
    }
    return user;
  }

  public static async updateRefreshToken(userId: string, refreshToken?: string): Promise<void> {
    await userRepository.updateRefreshToken(userId, refreshToken);
  }

  public static mapToDTO(user: IUser): UserDTO {
    return {
      id: user._id.toString(),
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    };
  }
}
