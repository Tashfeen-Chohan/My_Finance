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
  if (!data.vehicleId) {
    throw BadRequestError("Vehicle ID is required");
  }
  const vehicleId = data.vehicleId.toString();

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
  if (lastRefill) {
    const distanceTraveled = data.odometer! - lastRefill.odometer;
    const isFullTankInterval = Boolean(lastRefill.isFullTank && data.isFullTank);

    // Fuel Economy (km/L): distance traveled divided by fuel consumed (new refill quantity)
    const computedEconomy = isFullTankInterval && data.quantity! > 0
      ? Number((distanceTraveled / data.quantity!).toFixed(2))
      : null;

    // Cost/KM = (Refill A unit price * fuel consumed) / distance traveled
    const previousUnitPrice = lastRefill.unitPrice;
    const fuelConsumedCost = data.quantity! * previousUnitPrice;

    const costPerKM = isFullTankInterval && distanceTraveled > 0 && fuelConsumedCost > 0
      ? Number((fuelConsumedCost / distanceTraveled).toFixed(2))
      : null;

    // Daily Distance Driven (km/day): distanceTraveled / days elapsed between Refill A and Refill B
    const dateA = new Date(lastRefill.date);
    const dateB = new Date(createdExpense.date || data.date || Date.now());
    const diffInMs = Math.max(0, dateB.getTime() - dateA.getTime());
    const daysElapsed = Math.max(1, Math.round(diffInMs / (1000 * 60 * 60 * 24)));
    const dailyDistanceDriven = distanceTraveled > 0 ? Math.round(distanceTraveled / daysElapsed) : null;

    await fuelExpenseRepository.update(lastRefill._id.toString(), {
      distanceTraveled,
      computedEconomy,
      costPerKM,
      dailyDistanceDriven,
      isLocked: true,
      updatedBy: userId,
    });
  }

  // 4. Sync vehicle current odometer
  await vehicleRepository.syncOdometer(vehicleId);

  return createdExpense;
};

export const getUserFuelExpenses = async (userId: string): Promise<IFuelExpense[]> => {
  return await fuelExpenseRepository.findByUserId(userId);
};

export const getFuelExpensesByVehicle = async (vehicleId: string, userId: string): Promise<IFuelExpense[]> => {
  return await fuelExpenseRepository.findByVehicleId(vehicleId, userId);
};

export const getFuelExpenseById = async (id: string, userId: string): Promise<IFuelExpense> => {
  const expense = await fuelExpenseRepository.findOne({ _id: id, userId });
  if (!expense) {
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

  if (!updated) {
    throw NotFoundError("Fuel expense record failed to update");
  }

  // Re-sync previous refill stats if odometer/quantity/isFullTank of current refill changed
  if (lastRefill && updated.odometer && lastRefill.odometer < updated.odometer) {
    const distanceTraveled = updated.odometer - lastRefill.odometer;
    const isFullTankInterval = Boolean(lastRefill.isFullTank && updated.isFullTank);

    // Fuel Economy (km/L): distance traveled divided by fuel consumed (updated refill quantity)
    const computedEconomy = isFullTankInterval && updated.quantity > 0
      ? Number((distanceTraveled / updated.quantity).toFixed(2))
      : null;

    // Cost/KM = (Refill A unit price * fuel consumed) / distance traveled
    const previousUnitPrice = lastRefill.unitPrice;
    const fuelConsumedCost = updated.quantity * previousUnitPrice;

    const costPerKM = isFullTankInterval && distanceTraveled > 0 && fuelConsumedCost > 0
      ? Number((fuelConsumedCost / distanceTraveled).toFixed(2))
      : null;

    // Daily Distance Driven (km/day): distanceTraveled / days elapsed between Refill A and Refill B
    const dateA = new Date(lastRefill.date);
    const dateB = new Date(updated.date);
    const diffInMs = Math.max(0, dateB.getTime() - dateA.getTime());
    const daysElapsed = Math.max(1, Math.round(diffInMs / (1000 * 60 * 60 * 24)));
    const dailyDistanceDriven = distanceTraveled > 0 ? Math.round(distanceTraveled / daysElapsed) : null;

    await fuelExpenseRepository.update(lastRefill._id.toString(), {
      distanceTraveled,
      computedEconomy,
      costPerKM,
      dailyDistanceDriven,
      isLocked: true,
      updatedBy: userId,
    });
  }

  // Sync vehicle current odometer
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

  // Unroll previous refill: Unlock it and clear distance/economy/costPerKM
  const vehicleId = existing.vehicleId.toString();
  const previousRefill = await fuelExpenseRepository.getLatestRefill(vehicleId);

  if (previousRefill) {
    await fuelExpenseRepository.update(previousRefill._id.toString(), {
      distanceTraveled: null,
      computedEconomy: null,
      costPerKM: null,
      dailyDistanceDriven: null,
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
