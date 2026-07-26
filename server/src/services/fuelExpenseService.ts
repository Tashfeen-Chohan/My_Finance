import { fuelExpenseRepository } from "../repositories/fuelExpenseRepository";
import { vehicleRepository } from "../repositories/vehicleRepository";
import { IFuelExpense } from "../models/FuelExpense";
import { NotFoundError } from "../errors/ApiError";

export const createFuelExpense = async (userId: string, data: Partial<IFuelExpense>): Promise<IFuelExpense> => {
  if (!data.vehicleId) {
    throw new Error("Vehicle ID is required");
  }

  if (data.clientSyncId) {
    const existing = await fuelExpenseRepository.findBySyncId(data.clientSyncId, userId);
    if (existing) return existing;
  } else {
    data.clientSyncId = `fuel_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  const vehicle = await vehicleRepository.findById(data.vehicleId.toString());
  if (!vehicle || vehicle.userId.toString() !== userId) {
    throw new NotFoundError("Vehicle not found");
  }

  if (data.odometer !== undefined) {
    const lastRefill = await fuelExpenseRepository.getLatestRefill(data.vehicleId.toString());
    if (lastRefill && lastRefill.odometer < data.odometer) {
      if (!data.distanceTraveled) {
        data.distanceTraveled = data.odometer - lastRefill.odometer;
      }
      if (data.isFullTank && !data.computedEconomy && data.quantity && data.quantity > 0) {
        data.computedEconomy = Number((data.distanceTraveled / data.quantity).toFixed(2));
      }
    }

    await vehicleRepository.updateOdometer(data.vehicleId.toString(), data.odometer);
  }

  if (!data.totalCost && data.quantity && data.unitPrice) {
    data.totalCost = Number((data.quantity * data.unitPrice).toFixed(2));
  }

  return await fuelExpenseRepository.create({
    ...data,
    userId: userId as unknown as IFuelExpense["userId"],
    createdBy: userId as unknown as IFuelExpense["createdBy"],
    updatedBy: userId as unknown as IFuelExpense["updatedBy"],
  });
};

export const getUserFuelExpenses = async (userId: string): Promise<IFuelExpense[]> => {
  return await fuelExpenseRepository.findByUserId(userId);
};

export const getFuelExpensesByVehicle = async (vehicleId: string, userId: string): Promise<IFuelExpense[]> => {
  const vehicle = await vehicleRepository.findById(vehicleId);
  if (!vehicle || vehicle.userId.toString() !== userId) {
    throw new NotFoundError("Vehicle not found");
  }
  return await fuelExpenseRepository.findByVehicleId(vehicleId, userId);
};

export const getFuelExpenseById = async (id: string, userId: string): Promise<IFuelExpense> => {
  const expense = await fuelExpenseRepository.findById(id);
  if (!expense || expense.userId.toString() !== userId) {
    throw new NotFoundError("Fuel expense record not found");
  }
  return expense;
};

export const updateFuelExpense = async (id: string, userId: string, updateData: Partial<IFuelExpense>): Promise<IFuelExpense> => {
  await getFuelExpenseById(id, userId);

  if (updateData.quantity && updateData.unitPrice && !updateData.totalCost) {
    updateData.totalCost = Number((updateData.quantity * updateData.unitPrice).toFixed(2));
  }

  const updated = await fuelExpenseRepository.update(id, {
    ...updateData,
    updatedBy: userId as unknown as IFuelExpense["updatedBy"],
  });

  if (!updated) throw new NotFoundError("Fuel expense record failed to update");
  return updated;
};

export const deleteFuelExpense = async (id: string, userId: string): Promise<void> => {
  await getFuelExpenseById(id, userId);
  await fuelExpenseRepository.softDelete(id, userId);
};

export const FuelExpenseService = {
  createFuelExpense,
  getUserFuelExpenses,
  getFuelExpensesByVehicle,
  getFuelExpenseById,
  updateFuelExpense,
  deleteFuelExpense,
};
