import { vehicleRepository } from "../repositories/vehicleRepository";
import { IVehicle } from "../models/Vehicle";
import { NotFoundError, BadRequestError } from "../errors/ApiError";

export const createVehicle = async (userId: string, data: Partial<IVehicle>): Promise<IVehicle> => {
  if (data.clientSyncId) {
    const existing = await vehicleRepository.findBySyncId(data.clientSyncId, userId);
    if (existing) {
      return existing;
    }
  } else {
    data.clientSyncId = `vehicle_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  if (data.initialOdometer !== undefined && data.currentOdometer !== undefined) {
    if (data.currentOdometer < data.initialOdometer) {
      throw new BadRequestError("Current odometer reading cannot be less than initial odometer reading");
    }
  }

  // If this is the user's first vehicle or set as default, handle defaults
  const userVehicles = await vehicleRepository.findByUserId(userId);
  const isFirstVehicle = userVehicles.length === 0;

  if (data.isDefault || isFirstVehicle) {
    await vehicleRepository.clearDefaultVehicles(userId);
    data.isDefault = true;
  }

  return await vehicleRepository.create({
    ...data,
    userId: userId as unknown as IVehicle["userId"],
    createdBy: userId as unknown as IVehicle["createdBy"],
    updatedBy: userId as unknown as IVehicle["updatedBy"],
  });
};

export const getUserVehicles = async (userId: string): Promise<IVehicle[]> => {
  return await vehicleRepository.findByUserId(userId);
};

export const getVehicleById = async (vehicleId: string, userId: string): Promise<IVehicle> => {
  const vehicle = await vehicleRepository.findById(vehicleId);
  if (!vehicle || vehicle.userId.toString() !== userId) {
    throw new NotFoundError("Vehicle not found");
  }
  return vehicle;
};

export const updateVehicle = async (vehicleId: string, userId: string, updateData: Partial<IVehicle>): Promise<IVehicle> => {
  const vehicle = await getVehicleById(vehicleId, userId);

  if (updateData.currentOdometer !== undefined && updateData.currentOdometer < vehicle.initialOdometer) {
    throw new BadRequestError("Current odometer reading cannot be less than initial odometer reading");
  }

  if (updateData.isDefault) {
    await vehicleRepository.setDefaultVehicle(vehicleId, userId);
  }

  const updated = await vehicleRepository.update(vehicleId, {
    ...updateData,
    updatedBy: userId as unknown as IVehicle["updatedBy"],
  });

  if (!updated) {
    throw new NotFoundError("Vehicle failed to update");
  }

  return updated;
};

export const setDefaultVehicle = async (vehicleId: string, userId: string): Promise<IVehicle> => {
  await getVehicleById(vehicleId, userId);
  await vehicleRepository.setDefaultVehicle(vehicleId, userId);
  return await getVehicleById(vehicleId, userId);
};

export const deleteVehicle = async (vehicleId: string, userId: string): Promise<void> => {
  const vehicle = await getVehicleById(vehicleId, userId);
  await vehicleRepository.softDelete(vehicle._id.toString(), userId);
};

export const VehicleService = {
  createVehicle,
  getUserVehicles,
  getVehicleById,
  updateVehicle,
  setDefaultVehicle,
  deleteVehicle,
};
