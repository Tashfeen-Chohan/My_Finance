"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function FuelHeader({ onLogFuelRefill }) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Fuel Expenses
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Track fuel refills, mileage efficiency (km/L), and monthly spend.
        </p>
      </div>

      <Button onClick={onLogFuelRefill} className="w-full sm:w-auto gap-2 font-medium">
        <Plus className="h-4 w-4" />
        Log Fuel Refill
      </Button>
    </div>
  );
}
