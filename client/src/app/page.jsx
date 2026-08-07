"use client";

import {
  useDashboardStats,
  useDashboardRecentActivity,
  useDashboardUpcomingReminders,
  useDashboardMonthlyComparison,
} from "@/hooks/use-dashboard-query";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardKpiCards } from "@/components/dashboard/dashboard-kpi-cards";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { MonthlyComparisonCard } from "@/components/dashboard/monthly-comparison-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { DashboardRemindersCard } from "@/components/dashboard/dashboard-reminders-card";
import { useVehicles, useDefaultVehicle } from "@/hooks/use-vehicles-query";

export default function DashboardPage() {
  const { defaultVehicleId } = useDefaultVehicle();

  const { data: statsData, isLoading: isStatsLoading } = useDashboardStats(defaultVehicleId);
  const { data: monthlyComparison = [], isLoading: isMonthlyLoading } = useDashboardMonthlyComparison(defaultVehicleId);
  const { data: recentActivity = [], isLoading: isActivityLoading } = useDashboardRecentActivity(defaultVehicleId);
  const { data: upcomingServices = [], isLoading: isRemindersLoading } = useDashboardUpcomingReminders(defaultVehicleId);
  const { data: vehicles = [] } = useVehicles();

  const expenses = statsData?.expenses || {};
  const vehiclesCount = statsData?.vehicles || {};

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      {/* Header Banner */}
      <DashboardHeader />

      {/* Summary KPI Cards */}
      <DashboardKpiCards expenses={expenses} vehicles={vehiclesCount} isLoading={isStatsLoading} />

      {/* Expense Distribution Charts */}
      <DashboardCharts expenses={expenses} isLoading={isStatsLoading} />

      {/* Monthly Fuel & Maintenance Comparison Bar Chart */}
      <MonthlyComparisonCard
        data={monthlyComparison}
        isLoading={isMonthlyLoading}
      />

      {/* Grid Layout for Reminders & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardRemindersCard upcomingServices={upcomingServices} vehicles={vehicles} isLoading={isRemindersLoading} />
        <RecentActivityCard activityList={recentActivity} isLoading={isActivityLoading} />
      </div>
    </div>
  );
}
