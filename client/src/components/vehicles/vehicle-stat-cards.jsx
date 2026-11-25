"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Star, Gauge } from "lucide-react";

export function VehicleStatCards({ vehicles = [] }) {
  const defaultVehicle = vehicles.find((v) => v.isDefault) || vehicles[0];
  const totalOdometer = vehicles.reduce((acc, v) => acc + (v.currentOdometer || 0), 0);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
      <Card className="hover:border-primary/30 transition-colors">
        <CardContent className="p-4 sm:p-5 flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-stretch sm:gap-3">
          <div className="flex items-center gap-3 sm:justify-between sm:gap-2 min-w-0">
            <div className="flex h-10 w-10 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl sm:rounded-lg bg-primary/10 text-primary sm:order-2">
              <Car className="h-4 w-4" />
            </div>
            <div className="min-w-0 sm:order-1">
              <p className="text-xs font-medium text-muted-foreground">Registered</p>
              <p className="text-[11px] text-muted-foreground/80 sm:hidden">
                {vehicles.length === 1 ? "Active vehicle" : "Active vehicles"}
              </p>
            </div>
          </div>
          <div className="text-right sm:text-left space-y-0.5 shrink-0">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground tabular-nums">
              {vehicles.length}
            </h3>
            <p className="hidden sm:block text-[11px] text-muted-foreground">
              {vehicles.length === 1 ? "Active vehicle" : "Active vehicles"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:border-primary/30 transition-colors">
        <CardContent className="p-4 sm:p-5 flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-stretch sm:gap-3">
          <div className="flex items-center gap-3 sm:justify-between sm:gap-2 min-w-0">
            <div className="flex h-10 w-10 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl sm:rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 sm:order-2">
              <Star className="h-4 w-4" />
            </div>
            <div className="min-w-0 sm:order-1">
              <p className="text-xs font-medium text-muted-foreground">Primary</p>
              <p className="text-[11px] text-muted-foreground/80 sm:hidden">
                {defaultVehicle ? "Default selection" : "No default set"}
              </p>
            </div>
          </div>
          <div className="text-right sm:text-left space-y-0.5 min-w-0">
            <h3 className="text-base sm:text-xl font-bold text-foreground truncate">
              {defaultVehicle ? defaultVehicle.name : "None"}
            </h3>
            <p className="hidden sm:block text-[11px] text-muted-foreground truncate">
              {defaultVehicle ? "Default selection" : "No default set"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:border-primary/30 transition-colors">
        <CardContent className="p-4 sm:p-5 flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-stretch sm:gap-3">
          <div className="flex items-center gap-3 sm:justify-between sm:gap-2 min-w-0">
            <div className="flex h-10 w-10 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl sm:rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 sm:order-2">
              <Gauge className="h-4 w-4" />
            </div>
            <div className="min-w-0 sm:order-1">
              <p className="text-xs font-medium text-muted-foreground">Fleet Odometer</p>
              <p className="text-[11px] text-muted-foreground/80 sm:hidden">Combined mileage</p>
            </div>
          </div>
          <div className="text-right sm:text-left space-y-0.5 shrink-0">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground tabular-nums">
              {totalOdometer.toLocaleString()} km
            </h3>
            <p className="hidden sm:block text-[11px] text-muted-foreground">Combined mileage</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
