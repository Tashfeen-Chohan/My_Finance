"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Wrench, Plus } from "lucide-react";

export function MaintenanceHeader({ onLogMaintenance }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-center">
      <div className="space-y-1.5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-md shadow-purple-500/5 mt-0.5 sm:mt-0">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Vehicle Maintenance & Reminders
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
              Track oil changes, periodic services, workshop repairs, and upcoming reminders.
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={onLogMaintenance}
        size="lg"
        className="w-full sm:w-auto gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20 cursor-pointer rounded-xl"
      >
        <Plus className="h-5 w-5" />
        Log Maintenance
      </Button>
    </div>
  );
}
