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

export const mapUserToDTO = (user: IUser): UserDTO => {
  return {
    id: user._id.toString(),
    googleId: user.googleId,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };
};

export const findOrCreateUser = async (userData: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}): Promise<UserDTO> => {
  const cleanEmail = userData.email.toLowerCase().trim();
  const cleanGoogleId = userData.googleId.trim();

  let user = await userRepository.findByGoogleIdOrEmail(cleanGoogleId, cleanEmail);

  if (!user) {
    user = await userRepository.create({
      googleId: cleanGoogleId,
      email: cleanEmail,
      name: userData.name || cleanEmail.split("@")[0],
      avatarUrl: userData.avatarUrl,
      preferences: {
        currency: "PKR",
        distanceUnit: "km",
        fuelUnit: "liters",
        theme: "system",
      },
    });
  } else {
    // Restore user if soft-deleted
    if (user.isDeleted) {
      user.isDeleted = false;
      user.deletedAt = null;
    }

    // Update profile info and ensure googleId/email align
    if (userData.name) user.name = userData.name;
    if (userData.avatarUrl) user.avatarUrl = userData.avatarUrl;
    if (cleanGoogleId && user.googleId !== cleanGoogleId) user.googleId = cleanGoogleId;
    if (cleanEmail && user.email !== cleanEmail) user.email = cleanEmail;

    await user.save();
  }

  return mapUserToDTO(user);
};

export const getUserById = async (userId: string): Promise<IUser> => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw NotFoundError("User profile not found");
  }
  return user;
};

export const updateUserRefreshToken = async (userId: string, refreshToken?: string): Promise<void> => {
  await userRepository.updateRefreshToken(userId, refreshToken);
};

export const UserService = {
  findOrCreateUser,
  getUserById,
  updateUserRefreshToken,
  mapUserToDTO,
};
