import { vehicleRepository } from "../repositories/vehicleRepository";
import { fuelExpenseRepository } from "../repositories/fuelExpenseRepository";
import { maintenanceExpenseRepository } from "../repositories/maintenanceExpenseRepository";

export interface DashboardSummary {
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
  upcomingServices: unknown[];
  recentActivity: unknown[];
}

export const getDashboardSummary = async (userId: string): Promise<DashboardSummary> => {
  const [vehicles, fuelData, maintenanceData, upcomingServices] = await Promise.all([
    vehicleRepository.findByUserId(userId),
    fuelExpenseRepository.aggregateTotalFuelCost(userId),
    maintenanceExpenseRepository.aggregateTotalMaintenanceCost(userId),
    maintenanceExpenseRepository.getUpcomingServices(userId),
  ]);

  const fuelExpenses = await fuelExpenseRepository.find({ userId });
  const maintenanceExpenses = await maintenanceExpenseRepository.find({ userId });

  const recentActivity = [
    ...fuelExpenses.map((f) => ({
      id: f._id,
      type: "fuel" as const,
      title: `Fuel Refill - ${f.quantity} L`,
      cost: f.totalCost,
      date: f.date,
      vehicleId: f.vehicleId,
    })),
    ...maintenanceExpenses.map((m) => ({
      id: m._id,
      type: "maintenance" as const,
      title: m.title,
      cost: m.cost ?? (m as unknown as { totalCost: number }).totalCost ?? 0,
      date: m.date,
      vehicleId: m.vehicleId,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

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
    upcomingServices: upcomingServices.slice(0, 5),
    recentActivity,
  };
};

export const DashboardService = {
  getSummary: getDashboardSummary,
};
