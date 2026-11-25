"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function VehicleHeader({ onAddVehicle }) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Vehicles</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Manage registered vehicles, odometer readings, and default selection.
        </p>
      </div>

      <Button onClick={onAddVehicle} className="w-full sm:w-auto gap-2 font-medium">
        <Plus className="h-4 w-4" />
        Add Vehicle
      </Button>
    </div>
  );
}
