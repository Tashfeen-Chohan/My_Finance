import { FuelExpense } from "../models/FuelExpense";
import { MaintenanceExpense } from "../models/MaintenanceExpense";
import { vehicleRepository } from "../repositories/vehicleRepository";
import { fuelExpenseRepository } from "../repositories/fuelExpenseRepository";
import { maintenanceExpenseRepository } from "../repositories/maintenanceExpenseRepository";
import { preferenceRepository } from "../repositories/preferenceRepository";
import { DEFAULT_FULL_TANK_DISTANCE, DEFAULT_RESERVE_DISTANCE } from "../constants/preferences";

export interface DashboardStats {
  vehicles: {
    total: number;
    active: number;
  };
  expenses: {
    totalFuelSpend: number;
    totalFuelVolume: number;
    totalMaintenanceSpend: number;
    maintenanceCount: number;
    grandTotalSpend: number;
  };
}

export interface RecentActivityItem {
  id: unknown;
  type: "fuel" | "maintenance";
  title: string;
  cost: number;
  date: Date | string;
  vehicleId: unknown;
}

export const getDashboardStats = async (userId: string, vehicleId: string): Promise<DashboardStats> => {
  const [vehicles, fuelData, maintenanceData] = await Promise.all([
    vehicleRepository.findByUserId(userId),
    fuelExpenseRepository.aggregateTotalFuelCost(userId, vehicleId),
    maintenanceExpenseRepository.aggregateTotalMaintenanceCost(userId, vehicleId),
  ]);

  return {
    vehicles: {
      total: vehicles.length,
      active: vehicles.length,
    },
    expenses: {
      totalFuelSpend: Number(fuelData.totalCost.toFixed(2)),
      totalFuelVolume: Number(fuelData.totalVolume.toFixed(2)),
      totalMaintenanceSpend: Number(maintenanceData.totalCost.toFixed(2)),
      maintenanceCount: maintenanceData.count,
      grandTotalSpend: Number((fuelData.totalCost + maintenanceData.totalCost).toFixed(2)),
    },
  };
};

export const getDashboardRecentActivity = async (
  userId: string,
  vehicleId: string,
  limitPerCategory = 3
): Promise<RecentActivityItem[]> => {
  const filter = { userId, vehicleId, isDeleted: false };

  const [fuelExpenses, maintenanceExpenses] = await Promise.all([
    FuelExpense.find(filter).sort({ date: -1 }).limit(limitPerCategory).lean(),
    MaintenanceExpense.find(filter).sort({ date: -1 }).limit(limitPerCategory).lean(),
  ]);

  const recentFuel = fuelExpenses.map((f) => ({
    id: f._id,
    type: "fuel" as const,
    title: `Fuel Refill - ${f.quantity} L`,
    cost: f.totalCost,
    date: f.date,
    vehicleId: f.vehicleId,
  }));

  const recentMaintenance = maintenanceExpenses.map((m) => ({
    id: m._id,
    type: "maintenance" as const,
    title: m.title,
    cost: m.cost ?? (m as unknown as { totalCost: number }).totalCost ?? 0,
    date: m.date,
    vehicleId: m.vehicleId,
  }));

  return [...recentFuel, ...recentMaintenance]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
};

export const getDashboardUpcomingReminders = async (userId: string, vehicleId: string) => {
  const [upcomingMaintenance, latestFuelRefill, userPreferences] = await Promise.all([
    maintenanceExpenseRepository.getUpcomingServices(userId, vehicleId),
    fuelExpenseRepository.getLatestRefill(vehicleId),
    preferenceRepository.findByUserId(userId),
  ]);

  const fullTankDistance = userPreferences?.fullTankDistance ?? DEFAULT_FULL_TANK_DISTANCE;
  const reserveDistance = userPreferences?.reserveDistance ?? DEFAULT_RESERVE_DISTANCE;

  let fuelReminder = null;
  if (latestFuelRefill && latestFuelRefill.isFullTank && !latestFuelRefill.isLocked) {
    const currentOdometer = latestFuelRefill.odometer || 0;
    const reserveRange = Math.max(1, fullTankDistance - reserveDistance);
    fuelReminder = {
      currentOdometer,
      fullTankDistance,
      reserveDistance,
      expectedReserveOdometer: currentOdometer + reserveRange,
      expectedEmptyOdometer: currentOdometer + fullTankDistance,
      refillDate: latestFuelRefill.date,
    };
  }

  return {
    maintenance: upcomingMaintenance.slice(0, 10),
    fuel: fuelReminder,
  };
};

export const getDashboardSummary = async (userId: string, vehicleId: string) => {
  const [stats, recentActivity, upcomingServices] = await Promise.all([
    getDashboardStats(userId, vehicleId),
    getDashboardRecentActivity(userId, vehicleId),
    getDashboardUpcomingReminders(userId, vehicleId),
  ]);

  return {
    vehicles: stats.vehicles,
    expenses: stats.expenses,
    upcomingServices,
    recentActivity,
  };
};

export const DashboardService = {
  getStats: getDashboardStats,
  getRecentActivity: getDashboardRecentActivity,
  getUpcomingReminders: getDashboardUpcomingReminders,
  getSummary: getDashboardSummary,
};
