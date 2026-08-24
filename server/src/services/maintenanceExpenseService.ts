import { maintenanceExpenseRepository } from "../repositories/maintenanceExpenseRepository";
import { vehicleRepository } from "../repositories/vehicleRepository";
import { MaintenanceExpense, IMaintenanceExpense } from "../models/MaintenanceExpense";
import { NotFoundError, BadRequestError } from "../errors/ApiError";

export const createMaintenance = async (userId: string, data: Partial<IMaintenanceExpense>): Promise<IMaintenanceExpense> => {
  if (!data.vehicleId) {
    throw BadRequestError("Vehicle ID is required");
  }

  // Auto-complete older active reminders for this vehicle if user is logging a new service/oil change
  const vehicleIdStr = data.vehicleId.toString();
  const isOilChange = data.category === "oil_change" || Boolean(data.nextOilChangeOdometer || data.nextOilChangeOdometerMin);
  const isService = data.category === "service" || Boolean(data.nextServiceOdometer || data.nextServiceOdometerMin);

  if (isOilChange) {
    await MaintenanceExpense.updateMany(
      { vehicleId: vehicleIdStr, userId, isDeleted: false, isOilChangeCompleted: { $ne: true } },
      { $set: { isOilChangeCompleted: true } }
    );
  }
  if (isService) {
    await MaintenanceExpense.updateMany(
      { vehicleId: vehicleIdStr, userId, isDeleted: false, isServiceCompleted: { $ne: true } },
      { $set: { isServiceCompleted: true } }
    );
  }

  const created = await maintenanceExpenseRepository.create({
    ...data,
    userId: userId as unknown as IMaintenanceExpense["userId"],
    createdBy: userId as unknown as IMaintenanceExpense["createdBy"],
    updatedBy: userId as unknown as IMaintenanceExpense["updatedBy"],
  });

  await vehicleRepository.syncOdometer(created.vehicleId.toString());

  return created;
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

  const updated = await maintenanceExpenseRepository.update(id, {
    ...updateData,
    updatedBy: userId as unknown as IMaintenanceExpense["updatedBy"],
  });

  if (!updated) throw NotFoundError("Maintenance record failed to update");

  await vehicleRepository.syncOdometer(updated.vehicleId.toString());

  return updated;
};

export const deleteMaintenance = async (id: string, userId: string): Promise<void> => {
  const existing = await getMaintenanceById(id, userId);
  await maintenanceExpenseRepository.softDelete(id, userId);
  await vehicleRepository.syncOdometer(existing.vehicleId.toString());
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
