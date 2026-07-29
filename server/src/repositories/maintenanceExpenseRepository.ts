import { createBaseRepository } from "./baseRepository";
import { MaintenanceExpense, IMaintenanceExpense } from "../models/MaintenanceExpense";

const baseRepo = createBaseRepository<IMaintenanceExpense>(MaintenanceExpense);

export const maintenanceExpenseRepository = {
  ...baseRepo,

  findAllForUser: async (userId: string): Promise<IMaintenanceExpense[]> => {
    return await MaintenanceExpense.find({ userId, isDeleted: false }).sort({ date: -1 });
  },

  findByVehicleId: async (vehicleId: string, userId: string): Promise<IMaintenanceExpense[]> => {
    return await MaintenanceExpense.find({ vehicleId, userId, isDeleted: false }).sort({ date: -1 });
  },

  getUpcomingServices: async (userId: string): Promise<IMaintenanceExpense[]> => {
    return await MaintenanceExpense.find({
      userId,
      isDeleted: false,
      $or: [
        { nextServiceOdometer: { $exists: true, $ne: null, $gt: 0 } },
        { nextServiceOdometerMin: { $exists: true, $ne: null, $gt: 0 } },
        { nextServiceOdometerMax: { $exists: true, $ne: null, $gt: 0 } },
        { nextOilChangeOdometer: { $exists: true, $ne: null, $gt: 0 } },
        { nextOilChangeOdometerMin: { $exists: true, $ne: null, $gt: 0 } },
        { nextOilChangeOdometerMax: { $exists: true, $ne: null, $gt: 0 } },
      ],
    }).sort({ date: -1 });
  },

  aggregateTotalMaintenanceCost: async (userId: string, startDate?: Date, endDate?: Date): Promise<{ totalCost: number; count: number }> => {
    const match: Record<string, unknown> = { userId, isDeleted: false };
    if (startDate || endDate) {
      match.date = {};
      if (startDate) (match.date as Record<string, unknown>).$gte = startDate;
      if (endDate) (match.date as Record<string, unknown>).$lte = endDate;
    }

    const result = await MaintenanceExpense.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalCost: { $sum: "$cost" },
          count: { $sum: 1 },
        },
      },
    ]);

    return result[0] || { totalCost: 0, count: 0 };
  },
};
