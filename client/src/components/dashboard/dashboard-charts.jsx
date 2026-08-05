"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Activity, Fuel, Wrench } from "lucide-react";

export function DashboardCharts({ expenses = {}, isLoading = false }) {
  const fuelSpend = expenses.totalFuelSpend || 0;
  const maintenanceSpend = expenses.totalMaintenanceSpend || 0;
  const grandTotal = expenses.grandTotalSpend || 1;

  const fuelPct = Math.round((fuelSpend / grandTotal) * 100) || 0;
  const maintenancePct = Math.round((maintenanceSpend / grandTotal) * 100) || 0;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Category Expense Proportion Card */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <PieChart className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm sm:text-base font-bold truncate">Expense Distribution</CardTitle>
              <CardDescription className="text-[11px] sm:text-xs truncate">Fuel vs Maintenance proportion</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full rounded-full" />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          ) : (
            <>
              {/* Progress Bar Visualization */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary flex border border-border/20">
                <div
                  style={{ width: `${fuelPct}%` }}
                  className="bg-amber-500 transition-all duration-500"
                  title={`Fuel: ${fuelPct}%`}
                />
                <div
                  style={{ width: `${maintenancePct}%` }}
                  className="bg-purple-500 transition-all duration-500"
                  title={`Maintenance: ${maintenancePct}%`}
                />
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 sm:p-3 min-w-0 gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Fuel className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-semibold truncate">Fuel</span>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-amber-500 shrink-0">{fuelPct}%</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/5 p-2.5 sm:p-3 min-w-0 gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Wrench className="h-4 w-4 text-purple-400 shrink-0" />
                    <span className="text-xs font-semibold truncate">Maintenance</span>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-purple-400 shrink-0">{maintenancePct}%</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Vehicle Activity Summary Card */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Activity className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm sm:text-base font-bold truncate">Vehicle Activity Summary</CardTitle>
              <CardDescription className="text-[11px] sm:text-xs truncate">Fuel volume consumed & maintenance jobs logged</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-3 text-xs text-muted-foreground">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-full rounded" />
              <Skeleton className="h-6 w-full rounded" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-1.5 py-1.5 border-b border-border/40 min-w-0">
                <span className="truncate">Fuel Volume Consumed:</span>
                <strong className="text-foreground font-mono text-xs sm:text-sm shrink-0">
                  {expenses.totalFuelVolume || 0} Liters
                </strong>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1.5 py-1.5 min-w-0">
                <span className="truncate">Maintenance Jobs Logged:</span>
                <strong className="text-foreground font-mono text-xs sm:text-sm shrink-0">
                  {expenses.maintenanceCount || 0} Services
                </strong>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
