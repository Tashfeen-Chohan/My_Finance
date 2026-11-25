"use client";

import { KpiStatCards } from "@/components/common/kpi-stat-cards";
import { Fuel, Wallet, Gauge, TrendingUp } from "lucide-react";
import { FuelStatCardsSkeleton } from "@/components/skeletons";

export function FuelStatCards({ fuelExpenses = [], isLoading = false }) {
  if (isLoading) {
    return <FuelStatCardsSkeleton count={4} />;
  }

  const totalCost = fuelExpenses.reduce((acc, curr) => acc + (Number(curr.totalCost) || 0), 0);
  const totalVolume = fuelExpenses.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

  const validEconomies = fuelExpenses
    .map((f) => Number(f.computedEconomy))
    .filter((val) => !isNaN(val) && val > 0);

  const avgEconomy =
    validEconomies.length > 0
      ? Number((validEconomies.reduce((a, b) => a + b, 0) / validEconomies.length).toFixed(2))
      : 0;

  const validCostsPerKm = fuelExpenses
    .map((f) => Number(f.costPerKM ?? f.costPerKm))
    .filter((val) => !isNaN(val) && val > 0);

  const costPerKm =
    validCostsPerKm.length > 0
      ? Number((validCostsPerKm.reduce((a, b) => a + b, 0) / validCostsPerKm.length).toFixed(2))
      : 0;

  const cards = [
    {
      id: "fuel-total-cost",
      label: "Total Fuel Cost",
      value: `PKR ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      sublabel: `Across ${fuelExpenses.length} refills`,
      icon: <Wallet className="h-4 w-4" />,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      id: "fuel-total-volume",
      label: "Total Volume",
      value: `${totalVolume.toFixed(2)} L`,
      sublabel: "Total fuel pumped",
      icon: <Fuel className="h-4 w-4" />,
      iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
    {
      id: "fuel-avg-economy",
      label: "Avg. Mileage",
      value: avgEconomy > 0 ? `${avgEconomy} km/L` : "N/A",
      sublabel: validEconomies.length > 0 ? `${validEconomies.length} full-tank cycles` : "Needs full tank",
      icon: <Gauge className="h-4 w-4" />,
      iconBg: "bg-secondary text-foreground",
    },
    {
      id: "fuel-cost-per-km",
      label: "Cost per Kilometer",
      value: costPerKm > 0 ? `PKR ${costPerKm}/km` : "N/A",
      sublabel: "Running fuel rate",
      icon: <TrendingUp className="h-4 w-4" />,
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  ];

  return <KpiStatCards cards={cards} isLoading={isLoading} />;
}
