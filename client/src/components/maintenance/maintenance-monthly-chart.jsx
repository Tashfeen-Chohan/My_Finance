"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart2, TrendingUp, Wrench } from "lucide-react";
import { MaintenanceMonthlyChartSkeleton } from "@/components/skeletons";

export function MaintenanceMonthlyChart({ maintenanceLogs = [], isLoading = false }) {

  if (isLoading) {
    return <MaintenanceMonthlyChartSkeleton />;
  }

  // Generate last 6 months timeline
  const today = new Date();
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "short" });
    last6Months.push({ key: monthKey, label, year: d.getFullYear() });
  }

  const monthlyMap = {};
  last6Months.forEach(({ key, label }) => {
    monthlyMap[key] = { label, total: 0, count: 0 };
  });

  maintenanceLogs.forEach((item) => {
    const d = new Date(item.date || item.createdAt);
    if (isNaN(d.getTime())) return;
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyMap[monthKey]) {
      const cost = Number(item.cost ?? item.totalCost) || 0;
      monthlyMap[monthKey].total += cost;
      monthlyMap[monthKey].count += 1;
    }
  });

  const sortedMonths = last6Months.map(({ key }) => monthlyMap[key]);
  const totalPeriodSpend = sortedMonths.reduce((acc, m) => acc + m.total, 0);
  const avgMonthlyCost = Math.round(totalPeriodSpend / 6);
  const maxSpend = Math.max(...sortedMonths.map((m) => m.total), 1);

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-2xl shadow-xl rounded-2xl overflow-hidden transition-all duration-300">
      <CardHeader className="pb-3.5 pt-5 px-4 sm:px-6 border-b border-border/30 bg-secondary/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-sm backdrop-blur-md">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-extrabold text-foreground tracking-tight flex items-center gap-2">
                Monthly Maintenance Cost
              </CardTitle>
            </div>
          </div>

          {/* Average Per Month Badge */}
          <div className="flex items-center justify-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl text-xs shrink-0 whitespace-nowrap shadow-xs">
            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-semibold text-[11px] sm:text-xs">Avg. Monthly:</span>
              <span className="font-extrabold font-mono text-purple-600 dark:text-purple-400 text-xs sm:text-sm">
                PKR {avgMonthlyCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        {totalPeriodSpend === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 text-center text-xs text-muted-foreground bg-secondary/10 p-6">
            <Wrench className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="font-bold text-foreground">No Maintenance Expenses Logged</p>
            <p className="text-[11px] text-muted-foreground max-w-xs mt-1">
              Logged service records will automatically populate the monthly expenditure timeline here.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex h-56 items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-border/40">
              {sortedMonths.map((m, idx) => {
                const heightPercent = m.total > 0 ? Math.max(12, Math.round((m.total / maxSpend) * 100)) : 4;
                return (
                  <div key={idx} className="group relative flex-1 flex flex-col items-center h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs font-semibold px-2.5 py-1 rounded-md shadow-md pointer-events-none z-10 whitespace-nowrap border">
                      PKR {m.total.toLocaleString()} ({m.count} logs)
                    </div>

                    {/* Animated Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        m.total > 0
                          ? "bg-gradient-to-t from-purple-600/60 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/30"
                          : "bg-purple-500/10"
                      }`}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
