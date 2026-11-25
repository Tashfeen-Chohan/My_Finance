"use client";

import { KpiStatCards } from "@/components/common/kpi-stat-cards";
import { MaintenanceStatCardsSkeleton } from "@/components/skeletons";
import { Wrench, Droplet, Wallet, CalendarCheck } from "lucide-react";

export function MaintenanceStatCards({ maintenanceLogs = [], upcomingServices = [], isLoading = false }) {
  if (isLoading) {
    return <MaintenanceStatCardsSkeleton count={4} />;
  }

  const totalCost = maintenanceLogs.reduce((acc, item) => acc + (Number(item.cost ?? item.totalCost) || 0), 0);

  const oilChangesCount = maintenanceLogs.filter(
    (item) => item.category === "oil_change" || item.category === "service_and_oil_change"
  ).length;

  const servicesCount = maintenanceLogs.filter(
    (item) =>
      item.category === "service" ||
      item.category === "repair" ||
      item.category === "part_replacement" ||
      item.category === "service_and_oil_change"
  ).length;

  const upcomingCount = upcomingServices.reduce((acc, item) => {
    let count = 0;
    const hasOil = item.nextOilChangeOdometerMin || item.nextOilChangeOdometerMax || item.nextOilChangeOdometer;
    const hasService = item.nextServiceOdometerMin || item.nextServiceOdometerMax || item.nextServiceOdometer;
    if (hasOil) count++;
    if (hasService) count++;
    return acc + count;
  }, 0);

  const cards = [
    {
      id: "maint-total-cost",
      label: "Total Expense",
      value: `PKR ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      sublabel: `Across ${maintenanceLogs.length} logs`,
      icon: <Wallet className="h-4 w-4" />,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      id: "maint-oil-changes",
      label: "Oil Changes",
      value: `${oilChangesCount}`,
      sublabel: "Logged oil services",
      icon: <Droplet className="h-4 w-4" />,
      iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
    {
      id: "maint-services",
      label: "Services & Repairs",
      value: `${servicesCount}`,
      sublabel: "Workshop jobs",
      icon: <Wrench className="h-4 w-4" />,
      iconBg: "bg-secondary text-foreground",
    },
    {
      id: "maint-reminders",
      label: "Reminders",
      value: `${upcomingCount}`,
      sublabel: "Scheduled targets",
      icon: <CalendarCheck className="h-4 w-4" />,
      iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
  ];

  return <KpiStatCards cards={cards} isLoading={isLoading} />;
}
