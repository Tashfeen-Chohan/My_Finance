"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardCharts({ expenses = {}, isLoading = false }) {
  const fuelSpend = expenses.totalFuelSpend || 0;
  const maintenanceSpend = expenses.totalMaintenanceSpend || 0;
  const grandTotal = expenses.grandTotalSpend || 1;

  const fuelPct = Math.round((fuelSpend / grandTotal) * 100) || 0;
  const maintenancePct = Math.round((maintenanceSpend / grandTotal) * 100) || 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
      {/* Category Expense Proportion Card */}
      <Card>
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-semibold">Expense Breakdown</CardTitle>
          <CardDescription className="text-xs">Fuel vs. maintenance share of total spend</CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2 space-y-5">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-2.5 w-full rounded-full" />
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ) : (
            <>
              <div className="h-3 w-full overflow-hidden rounded-full bg-secondary flex gap-0.5">
                <div
                  style={{ width: `${fuelPct}%` }}
                  className="bg-teal-500 transition-all duration-500 rounded-l-full"
                  title={`Fuel: ${fuelPct}%`}
                />
                <div
                  style={{ width: `${maintenancePct}%` }}
                  className="bg-sky-500 dark:bg-sky-400 transition-all duration-500 rounded-r-full"
                  title={`Maintenance: ${maintenancePct}%`}
                />
              </div>

              <div className="grid grid-cols-2 items-center pt-1">
                <div className="flex items-center justify-between border-r-2 border-slate-300 dark:border-slate-600/80 pr-4 sm:pr-5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-teal-500 shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground truncate">Fuel</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-foreground">{fuelPct}%</span>
                </div>

                <div className="flex items-center justify-between pl-4 sm:pl-5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-500 dark:bg-sky-400 shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground truncate">Maintenance</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-foreground">{maintenancePct}%</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Vehicle Activity Summary Card */}
      <Card>
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-semibold">Activity Summary</CardTitle>
          <CardDescription className="text-xs">Total fuel volume and completed service logs</CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full rounded" />
              <Skeleton className="h-8 w-full rounded" />
            </div>
          ) : (
            <div className="divide-y divide-border text-sm">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground text-xs sm:text-sm">Fuel Volume Consumed</span>
                <span className="font-semibold tabular-nums text-foreground">
                  {expenses.totalFuelVolume || 0} L
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground text-xs sm:text-sm">Maintenance Jobs Logged</span>
                <span className="font-semibold tabular-nums text-foreground">
                  {expenses.maintenanceCount || 0} services
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
