"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Car, Plus } from "lucide-react";

export function VehicleHeader({ onAddVehicle }) {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
            <Car className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Vehicles Garage</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage your registered vehicles, track odometer readings, and configure default preferences.
        </p>
      </div>

      <Button onClick={onAddVehicle} size="lg" className="gap-2 shadow-lg shadow-primary/20 cursor-pointer">
        <Plus className="h-5 w-5" />
        Add New Vehicle
      </Button>
    </div>
  );
}
