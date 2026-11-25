"use client";

import { QuickActionsBar } from "./quick-actions-bar";

export function DashboardHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Finance Dashboard</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Monthly fuel expenditure, vehicle maintenance history, and active service reminders.
        </p>
      </div>

      <QuickActionsBar />
    </div>
  );
}
