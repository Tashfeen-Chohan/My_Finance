"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Star, Gauge } from "lucide-react";

export function VehicleStatCards({ vehicles = [] }) {
  const defaultVehicle = vehicles.find((v) => v.isDefault) || vehicles[0];
  const totalOdometer = vehicles.reduce((acc, v) => acc + (v.currentOdometer || 0), 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Total Vehicles */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Registered</p>
            <h3 className="text-2xl font-bold text-foreground">{vehicles.length} Vehicles</h3>
          </div>
        </CardContent>
      </Card>

      {/* Primary Vehicle */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Star className="h-6 w-6 fill-amber-500/20" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Primary Vehicle</p>
            <h3 className="text-lg font-bold text-foreground truncate">
              {defaultVehicle ? defaultVehicle.name : "None Selected"}
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Total Odometer Distance */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Gauge className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Distance Covered</p>
            <h3 className="text-2xl font-bold text-foreground">
              {totalOdometer.toLocaleString()} km
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
