"use client";

import React from "react";
import { useDashboardSummary } from "@/hooks/use-dashboard-query";
import { DashboardKpiCards } from "@/components/dashboard/dashboard-kpi-cards";
import { QuickActionsBar } from "@/components/dashboard/quick-actions-bar";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { MaintenanceRemindersCard } from "@/components/maintenance/maintenance-reminders-card";
import { useVehicles } from "@/hooks/use-vehicles-query";
import { LayoutDashboard, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: dashboardData, isLoading } = useDashboardSummary();
  const { data: vehicles = [] } = useVehicles();

  const expenses = dashboardData?.expenses || {};
  const vehiclesCount = dashboardData?.vehicles || {};
  const upcomingServices = dashboardData?.upcomingServices || [];
  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm backdrop-blur-md">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Finance Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Overview of monthly fuel expenditure, vehicle maintenance history, and active service reminders.
          </p>
        </div>

        <QuickActionsBar />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading dashboard overview...</p>
        </div>
      ) : (
        <>
          {/* Summary KPI Cards */}
          <DashboardKpiCards expenses={expenses} vehicles={vehiclesCount} />

          {/* Charts & Distribution */}
          <DashboardCharts expenses={expenses} />

          {/* Grid Layout for Reminders & Recent Activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MaintenanceRemindersCard upcomingServices={upcomingServices} vehicles={vehicles} />
            <RecentActivityCard activityList={recentActivity} />
          </div>
        </>
      )}
    </div>
  );
}
