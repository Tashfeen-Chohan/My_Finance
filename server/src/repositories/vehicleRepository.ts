import { createBaseRepository } from "./baseRepository";
import { Vehicle, IVehicle } from "../models/Vehicle";

const baseRepo = createBaseRepository<IVehicle>(Vehicle);

export const vehicleRepository = {
  ...baseRepo,

  findByUserId: async (userId: string): Promise<IVehicle[]> => {
    return await baseRepo.find({ userId });
  },

  updateOdometer: async (vehicleId: string, newOdometer: number): Promise<void> => {
    await Vehicle.updateOne(
      { _id: vehicleId, currentOdometer: { $lt: newOdometer } },
      { $set: { currentOdometer: newOdometer } }
    );
  },

  clearDefaultVehicles: async (userId: string): Promise<void> => {
    await Vehicle.updateMany({ userId }, { $set: { isDefault: false } });
  },

  setDefaultVehicle: async (vehicleId: string, userId: string): Promise<void> => {
    await Vehicle.updateMany({ userId }, { $set: { isDefault: false } });
    await Vehicle.updateOne({ _id: vehicleId, userId }, { $set: { isDefault: true } });
  },
};
