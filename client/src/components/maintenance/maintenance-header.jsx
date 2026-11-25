"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function MaintenanceHeader({ onLogMaintenance }) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Maintenance & Reminders
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Track oil changes, periodic services, repairs, and upcoming targets.
        </p>
      </div>

      <Button onClick={onLogMaintenance} className="w-full sm:w-auto gap-2 font-medium">
        <Plus className="h-4 w-4" />
        Log Maintenance
      </Button>
    </div>
  );
}
