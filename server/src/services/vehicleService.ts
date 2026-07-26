import { vehicleRepository } from "../repositories/vehicleRepository";
import { IVehicle } from "../models/Vehicle";
import { NotFoundError, ConflictError, BadRequestError } from "../errors/ApiError";

export class VehicleService {
  public static async createVehicle(userId: string, data: Partial<IVehicle>): Promise<IVehicle> {
    if (data.clientSyncId) {
      const existing = await vehicleRepository.findBySyncId(data.clientSyncId, userId);
      if (existing) {
        return existing;
      }
    }

    if (data.initialOdometer !== undefined && data.currentOdometer !== undefined) {
      if (data.currentOdometer < data.initialOdometer) {
        throw new BadRequestError("Current odometer reading cannot be less than initial odometer reading");
      }
    }

    return await vehicleRepository.create({
      ...data,
      userId: userId as unknown as IVehicle["userId"],
      createdBy: userId as unknown as IVehicle["createdBy"],
      updatedBy: userId as unknown as IVehicle["updatedBy"],
    });
  }

  public static async getUserVehicles(userId: string): Promise<IVehicle[]> {
    return await vehicleRepository.findByUserId(userId);
  }

  public static async getVehicleById(vehicleId: string, userId: string): Promise<IVehicle> {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle || vehicle.userId.toString() !== userId) {
      throw new NotFoundError("Vehicle not found");
    }
    return vehicle;
  }

  public static async updateVehicle(vehicleId: string, userId: string, updateData: Partial<IVehicle>): Promise<IVehicle> {
    const vehicle = await this.getVehicleById(vehicleId, userId);

    if (updateData.currentOdometer !== undefined && updateData.currentOdometer < vehicle.initialOdometer) {
      throw new BadRequestError("Current odometer reading cannot be less than initial odometer reading");
    }

    const updated = await vehicleRepository.update(vehicleId, {
      ...updateData,
      updatedBy: userId as unknown as IVehicle["updatedBy"],
    });

    if (!updated) {
      throw new NotFoundError("Vehicle failed to update");
    }

    return updated;
  }

  public static async deleteVehicle(vehicleId: string, userId: string): Promise<void> {
    const vehicle = await this.getVehicleById(vehicleId, userId);
    await vehicleRepository.softDelete(vehicle._id.toString(), userId);
  }
}
