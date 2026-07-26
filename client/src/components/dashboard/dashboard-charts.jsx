"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PieChart, TrendingUp, Fuel, Wrench } from "lucide-react";

export function DashboardCharts({ expenses = {} }) {
  const fuelSpend = expenses.totalFuelSpend || 0;
  const maintenanceSpend = expenses.totalMaintenanceSpend || 0;
  const grandTotal = expenses.grandTotalSpend || 1;

  const fuelPct = Math.round((fuelSpend / grandTotal) * 100) || 0;
  const maintenancePct = Math.round((maintenanceSpend / grandTotal) * 100) || 0;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Category Expense Proportion Card */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <PieChart className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Expense Distribution</CardTitle>
              <CardDescription className="text-xs">Fuel vs Maintenance proportion</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar Visualization */}
          <div className="h-4 w-full overflow-hidden rounded-full bg-secondary flex">
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

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-semibold">Fuel</span>
              </div>
              <span className="text-sm font-extrabold text-amber-500">{fuelPct}%</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/5 p-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-semibold">Maintenance</span>
              </div>
              <span className="text-sm font-extrabold text-purple-400">{maintenancePct}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend Insights Card */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Monthly Spending Insights</CardTitle>
              <CardDescription className="text-xs">Summary breakdown of accumulated vehicle costs</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span>Total Fuel Volume Consumed:</span>
            <strong className="text-foreground font-mono text-sm">{expenses.totalFuelVolume || 0} Liters</strong>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span>Maintenance Jobs Logged:</span>
            <strong className="text-foreground font-mono text-sm">{expenses.maintenanceCount || 0} Services</strong>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span>Grand Total Expenditure:</span>
            <strong className="text-emerald-500 font-mono text-sm">
              PKR {(expenses.grandTotalSpend || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </strong>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
