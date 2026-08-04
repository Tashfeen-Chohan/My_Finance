import { createBaseRepository } from "./baseRepository";
import { Preference, IPreference } from "../models/Preference";
import { DEFAULT_FULL_TANK_DISTANCE, DEFAULT_RESERVE_DISTANCE } from "../constants/preferences";

const baseRepo = createBaseRepository<IPreference>(Preference);

export const preferenceRepository = {
  ...baseRepo,

  findByUserId: async (userId: string): Promise<IPreference | null> => {
    return await Preference.findOne({ userId, isDeleted: false });
  },

  upsertByUserId: async (
    userId: string,
    data: { fullTankDistance?: number; reserveDistance?: number }
  ): Promise<IPreference> => {
    let preference = await Preference.findOne({ userId, isDeleted: false });
    if (!preference) {
      preference = await Preference.create({
        userId,
        fullTankDistance: data.fullTankDistance ?? DEFAULT_FULL_TANK_DISTANCE,
        reserveDistance: data.reserveDistance ?? DEFAULT_RESERVE_DISTANCE,
      });
    } else {
      if (data.fullTankDistance !== undefined) {
        preference.fullTankDistance = data.fullTankDistance;
      }
      if (data.reserveDistance !== undefined) {
        preference.reserveDistance = data.reserveDistance;
      }
      await preference.save();
    }
    return preference;
  },
};
