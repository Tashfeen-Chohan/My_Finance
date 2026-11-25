"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { MaintenanceMonthlyChartSkeleton } from "@/components/skeletons";

export function MaintenanceMonthlyChart({ maintenanceLogs = [], isLoading = false }) {
  if (isLoading) {
    return <MaintenanceMonthlyChartSkeleton />;
  }

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
    <Card>
      <CardHeader className="p-5 pb-4 border-b border-border flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Monthly Maintenance Cost</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Avg. monthly:{" "}
            <span className="font-semibold text-foreground tabular-nums">
              PKR {avgMonthlyCost.toLocaleString()}
            </span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        {totalPeriodSpend === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground p-6">
            <Wrench className="h-7 w-7 text-muted-foreground/40 mb-2" />
            <p className="font-medium text-foreground">No maintenance expenses logged</p>
            <p className="text-xs text-muted-foreground max-w-xs mt-1">
              Logged service records will populate your 6-month trend here.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex h-52 items-end gap-3 sm:gap-6 pt-6 pb-2 px-1 border-b border-border">
              {sortedMonths.map((m, idx) => {
                const heightPercent = m.total > 0 ? Math.max(10, Math.round((m.total / maxSpend) * 100)) : 4;
                return (
                  <div key={idx} className="group relative flex-1 flex flex-col items-center h-full justify-end">
                    <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs font-medium tabular-nums px-2.5 py-1 rounded-md shadow-sm pointer-events-none z-10 whitespace-nowrap border border-border">
                      PKR {m.total.toLocaleString()} ({m.count})
                    </div>

                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        m.total > 0
                          ? "bg-sky-500/85 group-hover:bg-sky-500 dark:bg-sky-400/85 dark:hover:bg-sky-400"
                          : "bg-border/60"
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between gap-2 sm:gap-6 pt-3 px-1">
              {sortedMonths.map((m, idx) => {
                const compactVal =
                  m.total >= 1000
                    ? `${(m.total / 1000).toFixed(m.total >= 10000 ? 0 : 1)}k`
                    : Math.round(m.total).toLocaleString();
                return (
                  <div key={idx} className="flex-1 text-center min-w-0">
                    <p className="text-[11px] sm:text-xs font-medium text-muted-foreground">{m.label}</p>
                    <p className="text-[10px] sm:text-[11px] font-semibold tabular-nums text-foreground mt-0.5 truncate">
                      <span className="sm:hidden">{compactVal}</span>
                      <span className="hidden sm:inline">{Math.round(m.total).toLocaleString()}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
