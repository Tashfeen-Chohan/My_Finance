import { BaseRepository } from "./baseRepository";
import { MaintenanceExpense, IMaintenanceExpense } from "../models/MaintenanceExpense";

export class MaintenanceExpenseRepository extends BaseRepository<IMaintenanceExpense> {
  constructor() {
    super(MaintenanceExpense);
  }

  async findByVehicleId(vehicleId: string, userId: string): Promise<IMaintenanceExpense[]> {
    return await this.model.find({ vehicleId, userId, isDeleted: false }).sort({ date: -1 });
  }

  async getUpcomingServices(userId: string): Promise<IMaintenanceExpense[]> {
    return await this.model
      .find({
        userId,
        isDeleted: false,
        nextServiceDate: { $gte: new Date() },
      })
      .sort({ nextServiceDate: 1 });
  }

  async aggregateTotalMaintenanceCost(userId: string, startDate?: Date, endDate?: Date): Promise<{ totalCost: number; count: number }> {
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
          count: { $sum: 1 },
        },
      },
    ]);

    return result[0] || { totalCost: 0, count: 0 };
  }
}

export const maintenanceExpenseRepository = new MaintenanceExpenseRepository();
