import { fuelExpenseRepository } from "../repositories/fuelExpenseRepository";
import { vehicleRepository } from "../repositories/vehicleRepository";
import { IFuelExpense } from "../models/FuelExpense";
import { NotFoundError, BadRequestError } from "../errors/ApiError";

/**
 * LIFO (Last-In, First-Out) Fuel Expense Service Logic:
 * - Only the most recent refill is unlocked (isLocked = false) and editable/deletable.
 * - When a new refill (B) is created, the previous refill (A) is calculated and locked (isLocked = true).
 * - Odometer values are strictly validated to prevent entering readings lower than previous refills.
 * - When the latest refill (B) is deleted, the previous refill (A) is unlocked and reset.
 */

export const createFuelExpense = async (userId: string, data: Partial<IFuelExpense>): Promise<IFuelExpense> => {
  const vehicleId = data.vehicleId!.toString();

  if (!data.vehicleId) {
    throw BadRequestError("Vehicle ID is required");
  }

  // 1. Fetch current latest refill before creating new one
  const lastRefill = await fuelExpenseRepository.getLatestRefill(vehicleId);

  // Odometer Validation: Prevent entering odometer lower than previous refill
  if (lastRefill && data.odometer! < lastRefill.odometer) {
    throw BadRequestError(`New odometer reading (${data.odometer} km) cannot be less than the previous refill reading (${lastRefill.odometer} km).`);
  }

  // 2. Create new fuel expense (starts unlocked)
  const createdExpense = await fuelExpenseRepository.create({
    ...data,
    isLocked: false,
    userId,
    createdBy: userId,
    updatedBy: userId,
  });

  // 3. Finalize and LOCK previous refill (Refill A)
  if (lastRefill && lastRefill.odometer < data.odometer!) {
    const distanceTraveled = data.odometer! - lastRefill.odometer;
    let computedEconomy: number | null = null;

    if (lastRefill.isFullTank && data.isFullTank) {
      computedEconomy = Number((distanceTraveled / data.quantity!).toFixed(2));
    }

    const lastRefillId = (lastRefill._id || lastRefill.id).toString();
    await fuelExpenseRepository.update(lastRefillId, {
      distanceTraveled,
      computedEconomy: computedEconomy ?? null,
      isLocked: true,
      updatedBy: userId,
    });
  }

  // 4. Sync vehicle current odometer directly
  await vehicleRepository.updateOdometer(vehicleId, data.odometer!);

  return createdExpense;
};

export const getUserFuelExpenses = async (userId: string): Promise<IFuelExpense[]> => {
  return await fuelExpenseRepository.findByUserId(userId);
};

export const getFuelExpensesByVehicle = async (vehicleId: string, userId: string): Promise<IFuelExpense[]> => {
  const vehicle = await vehicleRepository.findById(vehicleId);
  if (!vehicle || vehicle.userId.toString() !== userId) {
    throw NotFoundError("Vehicle not found");
  }
  return await fuelExpenseRepository.findByVehicleId(vehicleId, userId);
};

export const getFuelExpenseById = async (id: string, userId: string): Promise<IFuelExpense> => {
  const expense = await fuelExpenseRepository.findById(id);
  if (!expense || expense.userId.toString() !== userId) {
    throw NotFoundError("Fuel expense record not found");
  }
  return expense;
};

export const updateFuelExpense = async (id: string, userId: string, updateData: Partial<IFuelExpense>): Promise<IFuelExpense> => {
  const existing = await getFuelExpenseById(id, userId);

  // LIFO Guard: Block updating locked (non-latest) refills
  if (existing.isLocked) {
    throw BadRequestError("Only the latest fuel entry can be edited. Locked past entries cannot be modified.");
  }

  const vehicleId = existing.vehicleId.toString();
  const lastRefill = await fuelExpenseRepository.getLatestRefill(vehicleId, existing.date, id);

  // Odometer Validation: Prevent updating odometer to a value lower than the previous refill
  if (updateData.odometer !== undefined && lastRefill && updateData.odometer < lastRefill.odometer) {
    throw BadRequestError(`Updated odometer reading (${updateData.odometer} km) cannot be less than the previous refill reading (${lastRefill.odometer} km).`);
  }

  const updated = await fuelExpenseRepository.update(id, {
    ...updateData,
    updatedBy: userId,
  });

  if (!updated) throw NotFoundError("Fuel expense record failed to update");

  // Re-sync previous refill stats if odometer/quantity/isFullTank of current refill changed
  if (lastRefill && updated.odometer && lastRefill.odometer < updated.odometer) {
    const distanceTraveled = updated.odometer - lastRefill.odometer;
    let computedEconomy: number | null = null;

    if (lastRefill.isFullTank && updated.isFullTank) {
      computedEconomy = Number((distanceTraveled / updated.quantity).toFixed(2));
    }

    const lastRefillId = (lastRefill._id || lastRefill.id).toString();
    await fuelExpenseRepository.update(lastRefillId, {
      distanceTraveled,
      computedEconomy: computedEconomy ?? null,
      isLocked: true,
      updatedBy: userId,
    });
  }

  // Sync vehicle current odometer directly if odometer updated
  if (updated.odometer) {
    await vehicleRepository.updateOdometer(vehicleId, updated.odometer);
  }
  await vehicleRepository.syncOdometer(vehicleId);

  return updated;
};

export const deleteFuelExpense = async (id: string, userId: string): Promise<void> => {
  const existing = await getFuelExpenseById(id, userId);

  // LIFO Guard: Block deleting locked (non-latest) refills
  if (existing.isLocked) {
    throw BadRequestError("Only the latest fuel entry can be deleted. Please delete subsequent entries first.");
  }

  // Soft delete current latest entry
  await fuelExpenseRepository.softDelete(id, userId);

  // Unroll previous refill: Unlock it and clear distance/economy
  const vehicleId = existing.vehicleId.toString();
  const previousRefill = await fuelExpenseRepository.getLatestRefill(vehicleId);

  if (previousRefill) {
    const prevId = (previousRefill._id || previousRefill.id).toString();
    await fuelExpenseRepository.update(prevId, {
      distanceTraveled: undefined,
      computedEconomy: undefined,
      isLocked: false,
      updatedBy: userId,
    });
  }

  await vehicleRepository.syncOdometer(vehicleId);
};

export const FuelExpenseService = {
  createFuelExpense,
  getUserFuelExpenses,
  getFuelExpensesByVehicle,
  getFuelExpenseById,
  updateFuelExpense,
  deleteFuelExpense,
};
