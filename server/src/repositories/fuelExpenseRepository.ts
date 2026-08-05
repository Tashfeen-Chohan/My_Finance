import mongoose from "mongoose";
import { createBaseRepository } from "./baseRepository";
import { FuelExpense, IFuelExpense } from "../models/FuelExpense";

const baseRepo = createBaseRepository<IFuelExpense>(FuelExpense);

export const fuelExpenseRepository = {
  ...baseRepo,

  findByUserId: async (userId: string): Promise<IFuelExpense[]> => {
    return await FuelExpense.find({ userId, isDeleted: false }).sort({ date: -1, odometer: -1 });
  },

  findByVehicleId: async (vehicleId: string, userId: string): Promise<IFuelExpense[]> => {
    return await FuelExpense.find({ vehicleId, userId, isDeleted: false }).sort({ date: -1, odometer: -1 });
  },

  getLatestRefill: async (vehicleId: string, beforeDate?: Date, excludeId?: string): Promise<IFuelExpense | null> => {
    const filter: Record<string, unknown> = { vehicleId, isDeleted: false };
    if (beforeDate) {
      filter.date = { $lt: beforeDate };
    }
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    return await FuelExpense.findOne(filter).sort({ odometer: -1 });
  },

  aggregateTotalFuelCost: async (userId: string, vehicleId: string, startDate?: Date, endDate?: Date): Promise<{ totalCost: number; totalVolume: number }> => {
    const match: Record<string, unknown> = {
      userId: new mongoose.Types.ObjectId(userId),
      vehicleId: new mongoose.Types.ObjectId(vehicleId),
      isDeleted: false,
    };

    if (startDate || endDate) {
      match.date = {};
      if (startDate) (match.date as Record<string, unknown>).$gte = startDate;
      if (endDate) (match.date as Record<string, unknown>).$lte = endDate;
    }

    const result = await FuelExpense.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalCost: { $sum: "$totalCost" },
          totalVolume: { $sum: "$quantity" },
        },
      },
    ]);

    return result[0] || { totalCost: 0, totalVolume: 0 };
  },
};
