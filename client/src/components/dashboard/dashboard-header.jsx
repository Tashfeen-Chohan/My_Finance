"use client";

import { LayoutDashboard } from "lucide-react";
import { QuickActionsBar } from "./quick-actions-bar";

export function DashboardHeader() {
  return (
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
  );
}
