import mongoose from "mongoose";
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

export interface MonthlyComparisonItem {
  year: number;
  month: number;
  monthName: string;
  label: string;
  fuel: number;
  maintenance: number;
  total: number;
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

export const getDashboardMonthlyComparison = async (
  userId: string,
  vehicleId: string
): Promise<MonthlyComparisonItem[]> => {
  const now = new Date();
  const count = 6;

  const match: Record<string, unknown> = {
    userId: new mongoose.Types.ObjectId(userId),
    vehicleId: new mongoose.Types.ObjectId(vehicleId),
    isDeleted: false,
  };

  const [fuelMonthly, maintenanceMonthly] = await Promise.all([
    FuelExpense.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalFuel: { $sum: "$totalCost" },
        },
      },
    ]),
    MaintenanceExpense.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalMaintenance: { $sum: "$cost" },
        },
      },
    ]),
  ]);

  const monthMap = new Map<string, { year: number; month: number; fuel: number; maintenance: number }>();

  fuelMonthly.forEach((f) => {
    const key = `${f._id.year}-${String(f._id.month).padStart(2, "0")}`;
    monthMap.set(key, {
      year: f._id.year,
      month: f._id.month,
      fuel: Number(f.totalFuel.toFixed(2)),
      maintenance: 0,
    });
  });

  maintenanceMonthly.forEach((m) => {
    const key = `${m._id.year}-${String(m._id.month).padStart(2, "0")}`;
    const existing = monthMap.get(key) || {
      year: m._id.year,
      month: m._id.month,
      fuel: 0,
      maintenance: 0,
    };
    existing.maintenance = Number(m.totalMaintenance.toFixed(2));
    monthMap.set(key, existing);
  });

  if (monthMap.size === 0) {
    return [];
  }

  const sortedKeys = Array.from(monthMap.keys()).sort();
  const earliestKey = sortedKeys[0];
  const [earliestYear, earliestMonth] = earliestKey.split("-").map(Number);

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const totalMonthsDiff = (currentYear - earliestYear) * 12 + (currentMonth - earliestMonth) + 1;
  const numMonthsToShow = Math.min(totalMonthsDiff, count);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const result: MonthlyComparisonItem[] = [];

  for (let i = numMonthsToShow - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const monthNum = d.getMonth() + 1;
    const key = `${year}-${String(monthNum).padStart(2, "0")}`;
    const monthName = monthNames[d.getMonth()];
    const label = `${monthName} '${year.toString().slice(-2)}`;

    const dataItem = monthMap.get(key) || { fuel: 0, maintenance: 0 };
    const fuel = dataItem.fuel || 0;
    const maintenance = dataItem.maintenance || 0;

    result.push({
      year,
      month: monthNum,
      monthName,
      label,
      fuel,
      maintenance,
      total: Number((fuel + maintenance).toFixed(2)),
    });
  }

  return result;
};

export const DashboardService = {
  getStats: getDashboardStats,
  getRecentActivity: getDashboardRecentActivity,
  getUpcomingReminders: getDashboardUpcomingReminders,
  getMonthlyComparison: getDashboardMonthlyComparison,
};
