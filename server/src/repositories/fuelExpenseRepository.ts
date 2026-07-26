import { BaseRepository } from "./baseRepository";
import { FuelExpense, IFuelExpense } from "../models/FuelExpense";

export class FuelExpenseRepository extends BaseRepository<IFuelExpense> {
  constructor() {
    super(FuelExpense);
  }

  async findByVehicleId(vehicleId: string, userId: string): Promise<IFuelExpense[]> {
    return await this.model.find({ vehicleId, userId, isDeleted: false }).sort({ date: -1, odometer: -1 });
  }

  async getLatestRefill(vehicleId: string, beforeDate?: Date): Promise<IFuelExpense | null> {
    const filter: Record<string, unknown> = { vehicleId, isDeleted: false };
    if (beforeDate) {
      filter.date = { $lt: beforeDate };
    }
    return await this.model.findOne(filter).sort({ date: -1, odometer: -1 });
  }

  async aggregateTotalFuelCost(userId: string, startDate?: Date, endDate?: Date): Promise<{ totalCost: number; totalVolume: number }> {
    const match: Record<string, unknown> = { userId, isDeleted: false };
    if (startDate || endDate) {
      match.date = {};
      if (startDate) (match.date as Record<string, unknown>).$gte = startDate;
      if (endDate) (match.date as Record<string, unknown>).$lte = endDate;
    }

    const result = await this.model.aggregate([
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
  }
}

export const fuelExpenseRepository = new FuelExpenseRepository();
