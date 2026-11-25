"use client";

import { KpiStatCards } from "@/components/common/kpi-stat-cards";
import { Wallet, Fuel, Wrench, Car } from "lucide-react";

export function DashboardKpiCards({ expenses = {}, vehicles = {}, isLoading = false }) {
  const grandTotal = expenses.grandTotalSpend || 0;
  const fuelSpend = expenses.totalFuelSpend || 0;
  const maintenanceSpend = expenses.totalMaintenanceSpend || 0;
  const totalVehicles = vehicles.total || 0;

  const cards = [
    {
      id: "grand-total",
      label: "Total Spend",
      value: `PKR ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      sublabel: "Fuel + maintenance",
      icon: <Wallet className="h-4 w-4" />,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      id: "fuel-spend",
      label: "Fuel Spend",
      value: `PKR ${fuelSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      sublabel: `${expenses.totalFuelVolume || 0} L total volume`,
      icon: <Fuel className="h-4 w-4" />,
      iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
    {
      id: "maintenance-spend",
      label: "Maintenance",
      value: `PKR ${maintenanceSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      sublabel: `${expenses.maintenanceCount || 0} service logs`,
      icon: <Wrench className="h-4 w-4" />,
      iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
    {
      id: "vehicles-count",
      label: "Vehicles",
      value: `${totalVehicles}`,
      sublabel: totalVehicles === 1 ? "Active vehicle" : "Active vehicles",
      icon: <Car className="h-4 w-4" />,
      iconBg: "bg-secondary text-foreground",
    },
  ];

  return <KpiStatCards cards={cards} isLoading={isLoading} />;
}
