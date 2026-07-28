import { maintenanceExpenseRepository } from "../repositories/maintenanceExpenseRepository";
import { vehicleRepository } from "../repositories/vehicleRepository";
import { IMaintenanceExpense } from "../models/MaintenanceExpense";
import { NotFoundError, BadRequestError } from "../errors/ApiError";

export const createMaintenance = async (userId: string, data: Partial<IMaintenanceExpense>): Promise<IMaintenanceExpense> => {
  if (!data.vehicleId) {
    throw BadRequestError("Vehicle ID is required");
  }

  const vehicle = await vehicleRepository.findById(data.vehicleId.toString());
  if (!vehicle || vehicle.userId.toString() !== userId) {
    throw NotFoundError("Vehicle not found");
  }

  if (data.odometer !== undefined) {
    await vehicleRepository.updateOdometer(data.vehicleId.toString(), data.odometer);
  }

  return await maintenanceExpenseRepository.create({
    ...data,
    userId: userId as unknown as IMaintenanceExpense["userId"],
    createdBy: userId as unknown as IMaintenanceExpense["createdBy"],
    updatedBy: userId as unknown as IMaintenanceExpense["updatedBy"],
  });
};

export const getAllMaintenance = async (userId: string): Promise<IMaintenanceExpense[]> => {
  return await maintenanceExpenseRepository.findAllForUser(userId);
};

export const getMaintenanceByVehicle = async (vehicleId: string, userId: string): Promise<IMaintenanceExpense[]> => {
  const vehicle = await vehicleRepository.findById(vehicleId);
  if (!vehicle || vehicle.userId.toString() !== userId) {
    throw NotFoundError("Vehicle not found");
  }
  return await maintenanceExpenseRepository.findByVehicleId(vehicleId, userId);
};

export const getMaintenanceById = async (id: string, userId: string): Promise<IMaintenanceExpense> => {
  const record = await maintenanceExpenseRepository.findById(id);
  if (!record || record.userId.toString() !== userId) {
    throw NotFoundError("Maintenance record not found");
  }
  return record;
};

export const getUpcomingServices = async (userId: string): Promise<IMaintenanceExpense[]> => {
  return await maintenanceExpenseRepository.getUpcomingServices(userId);
};

export const updateMaintenance = async (id: string, userId: string, updateData: Partial<IMaintenanceExpense>): Promise<IMaintenanceExpense> => {
  await getMaintenanceById(id, userId);

  const updated = await maintenanceExpenseRepository.update(id, {
    ...updateData,
    updatedBy: userId as unknown as IMaintenanceExpense["updatedBy"],
  });

  if (!updated) throw NotFoundError("Maintenance record failed to update");
  return updated;
};

export const deleteMaintenance = async (id: string, userId: string): Promise<void> => {
  await getMaintenanceById(id, userId);
  await maintenanceExpenseRepository.softDelete(id, userId);
};

export const MaintenanceExpenseService = {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceByVehicle,
  getMaintenanceById,
  getUpcomingServices,
  updateMaintenance,
  deleteMaintenance,
};
