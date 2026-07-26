import { userRepository } from "../repositories/userRepository";
import { IUser } from "../models/User";
import { NotFoundError } from "../errors/ApiError";

export const getUserSettings = async (userId: string): Promise<IUser> => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError("User settings not found");
  }
  return user;
};

export const updateUserSettings = async (
  userId: string,
  updateData: {
    name?: string;
    preferences?: Partial<IUser["preferences"]>;
  }
): Promise<IUser> => {
  const user = await getUserSettings(userId);

  if (updateData.name) {
    user.name = updateData.name;
  }

  if (updateData.preferences) {
    user.preferences = {
      ...user.preferences,
      ...updateData.preferences,
    };
  }

  await user.save();
  return user;
};

export const SettingsService = {
  getUserSettings,
  updateUserSettings,
};
