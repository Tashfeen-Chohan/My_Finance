"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Wrench, Plus } from "lucide-react";

export function MaintenanceHeader({ onLogMaintenance }) {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm">
            <Wrench className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Vehicle Maintenance & Reminders</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Track oil changes, periodic services, workshop repairs, parts replacement, and upcoming reminders.
        </p>
      </div>

      <Button
        onClick={onLogMaintenance}
        size="lg"
        className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20 cursor-pointer"
      >
        <Plus className="h-5 w-5" />
        Log Maintenance
      </Button>
    </div>
  );
}
