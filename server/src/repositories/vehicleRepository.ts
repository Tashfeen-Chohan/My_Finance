import { createBaseRepository } from "./baseRepository";
import { Vehicle, IVehicle } from "../models/Vehicle";
import { FuelExpense } from "../models/FuelExpense";
import { MaintenanceExpense } from "../models/MaintenanceExpense";

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

  syncOdometer: async (vehicleId: string): Promise<void> => {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return;

    const maxFuel = await FuelExpense.findOne({ vehicleId, isDeleted: false }).sort({ odometer: -1 });
    const maxMaintenance = await MaintenanceExpense.findOne({ vehicleId, isDeleted: false }).sort({ odometer: -1 });

    const maxFuelOdometer = maxFuel?.odometer ?? 0;
    const maxMaintenanceOdometer = maxMaintenance?.odometer ?? 0;
    const initialOdometer = vehicle.initialOdometer ?? 0;

    const newCurrentOdometer = Math.max(initialOdometer, maxFuelOdometer, maxMaintenanceOdometer);

    await Vehicle.updateOne(
      { _id: vehicleId },
      { $set: { currentOdometer: newCurrentOdometer } }
    );
  },

  clearDefaultVehicles: async (userId: string): Promise<void> => {
    await Vehicle.updateMany({ userId }, { $set: { isDefault: false } });
  },

  setDefaultVehicle: async (vehicleId: string, userId: string): Promise<void> => {
    await Vehicle.updateMany({ userId }, { $set: { isDefault: false } });
    await Vehicle.updateOne({ _id: vehicleId, userId }, { $set: { isDefault: true } });
  },

  findDefaultByUserId: async (userId: string): Promise<IVehicle | null> => {
    return await Vehicle.findOne({ userId, isDefault: true, isDeleted: false });
  },
};
