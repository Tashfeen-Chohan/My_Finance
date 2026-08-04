import { preferenceRepository } from "../repositories/preferenceRepository";
import { IPreference } from "../models/Preference";
import { DEFAULT_PREFERENCES } from "../constants/preferences";

export const getUserPreferences = async (userId: string): Promise<IPreference> => {
  let preference = await preferenceRepository.findByUserId(userId);
  if (!preference) {
    preference = await preferenceRepository.upsertByUserId(userId, DEFAULT_PREFERENCES);
  }
  return preference;
};

export const updateUserPreferences = async (
  userId: string,
  data: { fullTankDistance?: number; reserveDistance?: number }
): Promise<IPreference> => {
  return await preferenceRepository.upsertByUserId(userId, data);
};

export const PreferenceService = {
  getUserPreferences,
  updateUserPreferences,
};
