"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Fuel, Plus } from "lucide-react";

export function FuelHeader({ onLogFuelRefill }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-center">
      <div className="space-y-1.5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-md shadow-amber-500/5 mt-0.5 sm:mt-0">
            <Fuel className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Fuel Expenses & Efficiency
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
              Track fuel refills, analyze average mileage (km/L), cost per kilometer, and monthly trends.
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={onLogFuelRefill}
        size="lg"
        className="w-full sm:w-auto gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 cursor-pointer rounded-xl"
      >
        <Plus className="h-5 w-5" />
        Log Fuel Refill
      </Button>
    </div>
  );
}
