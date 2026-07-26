"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart2, Calendar } from "lucide-react";

export function FuelMonthlyChart({ fuelExpenses }) {
  // Aggregate expenses by month (YYYY-MM)
  const monthlyMap = {};

  fuelExpenses.forEach((item) => {
    const d = new Date(item.date || item.createdAt);
    if (isNaN(d.getTime())) return;
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { label, total: 0, count: 0 };
    }
    monthlyMap[monthKey].total += Number(item.totalCost) || 0;
    monthlyMap[monthKey].count += 1;
  });

  const sortedMonths = Object.keys(monthlyMap)
    .sort()
    .slice(-6) // Last 6 months
    .map((key) => monthlyMap[key]);

  const maxSpend = Math.max(...sortedMonths.map((m) => m.total), 1);

  if (sortedMonths.length === 0) {
    return (
      <Card className="border-border/40 bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            <CardTitle>Monthly Expenditure Breakdown</CardTitle>
          </div>
          <CardDescription>Visual trend of monthly fuel expenses</CardDescription>
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg m-6">
          No monthly data logged yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Monthly Fuel Spend Trend</CardTitle>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
            <Calendar className="h-3.5 w-3.5" />
            Last 6 Months
          </div>
        </div>
        <CardDescription>Monthly aggregated fuel expenses breakdown</CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex h-56 items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-border/40">
          {sortedMonths.map((m, idx) => {
            const heightPercent = Math.max(12, Math.round((m.total / maxSpend) * 100));
            return (
              <div key={idx} className="group relative flex-1 flex flex-col items-center h-full justify-end">
                {/* Tooltip on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs font-semibold px-2.5 py-1 rounded-md shadow-md pointer-events-none z-10 whitespace-nowrap border">
                  PKR {m.total.toLocaleString()} ({m.count} refills)
                </div>

                {/* Animated Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary/60 to-primary transition-all duration-500 group-hover:from-primary group-hover:to-primary/80 group-hover:shadow-lg group-hover:shadow-primary/30"
                />
              </div>
            );
          })}
        </div>

        {/* Month Labels */}
        <div className="flex justify-between gap-3 sm:gap-6 pt-3 px-2">
          {sortedMonths.map((m, idx) => (
            <div key={idx} className="flex-1 text-center">
              <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
              <p className="text-[11px] font-semibold text-foreground mt-0.5">PKR {Math.round(m.total)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
