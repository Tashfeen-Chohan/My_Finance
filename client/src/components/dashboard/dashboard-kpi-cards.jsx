"use client";

import { KpiStatCards } from "@/components/common/kpi-stat-cards";
import { DollarSign, Fuel, Wrench, Car } from "lucide-react";

export function DashboardKpiCards({ expenses = {}, vehicles = {}, isLoading = false }) {
  const grandTotal = expenses.grandTotalSpend || 0;
  const fuelSpend = expenses.totalFuelSpend || 0;
  const maintenanceSpend = expenses.totalMaintenanceSpend || 0;
  const totalVehicles = vehicles.total || 0;

  const cards = [
    {
      id: "grand-total",
      label: "Grand Total Spend",
      value: `PKR ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: <DollarSign className="h-6 w-6" />,
      iconBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      id: "fuel-spend",
      label: "Fuel Spend",
      value: `PKR ${fuelSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: <Fuel className="h-6 w-6" />,
      iconBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    {
      id: "maintenance-spend",
      label: "Maintenance",
      value: `PKR ${maintenanceSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: <Wrench className="h-6 w-6" />,
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      id: "vehicles-count",
      label: "Vehicles Logged",
      value: `${totalVehicles} Vehicles`,
      icon: <Car className="h-6 w-6" />,
      iconBg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    },
  ];

  return <KpiStatCards cards={cards} isLoading={isLoading} />;
}
