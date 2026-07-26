import { maintenanceExpenseRepository } from "../repositories/maintenanceExpenseRepository";
import { vehicleRepository } from "../repositories/vehicleRepository";
import { IMaintenanceExpense } from "../models/MaintenanceExpense";
import { NotFoundError } from "../errors/ApiError";

export class MaintenanceExpenseService {
  public static async createMaintenance(userId: string, data: Partial<IMaintenanceExpense>): Promise<IMaintenanceExpense> {
    if (!data.vehicleId) {
      throw new Error("Vehicle ID is required");
    }

    if (data.clientSyncId) {
      const existing = await maintenanceExpenseRepository.findBySyncId(data.clientSyncId, userId);
      if (existing) return existing;
    }

    const vehicle = await vehicleRepository.findById(data.vehicleId.toString());
    if (!vehicle || vehicle.userId.toString() !== userId) {
      throw new NotFoundError("Vehicle not found");
    }

    if (data.odometer !== undefined) {
      await vehicleRepository.updateOdometer(data.vehicleId.toString(), data.odometer);
    }

    if (!data.totalCost) {
      data.totalCost = Number(((data.partsCost || 0) + (data.laborCost || 0)).toFixed(2));
    }

    return await maintenanceExpenseRepository.create({
      ...data,
      userId: userId as unknown as IMaintenanceExpense["userId"],
      createdBy: userId as unknown as IMaintenanceExpense["createdBy"],
      updatedBy: userId as unknown as IMaintenanceExpense["updatedBy"],
    });
  }

  public static async getMaintenanceByVehicle(vehicleId: string, userId: string): Promise<IMaintenanceExpense[]> {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle || vehicle.userId.toString() !== userId) {
      throw new NotFoundError("Vehicle not found");
    }
    return await maintenanceExpenseRepository.findByVehicleId(vehicleId, userId);
  }

  public static async getMaintenanceById(id: string, userId: string): Promise<IMaintenanceExpense> {
    const record = await maintenanceExpenseRepository.findById(id);
    if (!record || record.userId.toString() !== userId) {
      throw new NotFoundError("Maintenance record not found");
    }
    return record;
  }

  public static async getUpcomingServices(userId: string): Promise<IMaintenanceExpense[]> {
    return await maintenanceExpenseRepository.getUpcomingServices(userId);
  }

  public static async updateMaintenance(id: string, userId: string, updateData: Partial<IMaintenanceExpense>): Promise<IMaintenanceExpense> {
    await this.getMaintenanceById(id, userId);

    if (updateData.partsCost !== undefined || updateData.laborCost !== undefined) {
      const partsCost = updateData.partsCost !== undefined ? updateData.partsCost : 0;
      const laborCost = updateData.laborCost !== undefined ? updateData.laborCost : 0;
      if (!updateData.totalCost) {
        updateData.totalCost = Number((partsCost + laborCost).toFixed(2));
      }
    }

    const updated = await maintenanceExpenseRepository.update(id, {
      ...updateData,
      updatedBy: userId as unknown as IMaintenanceExpense["updatedBy"],
    });

    if (!updated) throw new NotFoundError("Maintenance record failed to update");
    return updated;
  }

  public static async deleteMaintenance(id: string, userId: string): Promise<void> {
    await this.getMaintenanceById(id, userId);
    await maintenanceExpenseRepository.softDelete(id, userId);
  }
}
