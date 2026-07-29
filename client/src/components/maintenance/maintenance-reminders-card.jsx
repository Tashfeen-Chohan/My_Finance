"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Gauge, Wrench, Droplet } from "lucide-react";

export function MaintenanceRemindersCard({ upcomingServices = [], vehicles = [] }) {
  const getVehicleName = (vehicleId) => {
    const vId = vehicleId?._id || vehicleId;
    const v = vehicles.find((item) => (item.id || item._id) === vId);
    return v ? v.name : "Vehicle";
  };

  // Separate upcoming services into distinct reminders for Oil Change and Service target ranges
  const reminders = [];
  upcomingServices.forEach((item) => {
    const vehicleName = getVehicleName(item.vehicleId);

    // 1. Oil Change Target Range
    const oilMin = item.nextOilChangeOdometerMin ?? (item.nextOilChangeOdometerMax ? null : item.nextOilChangeOdometer);
    const oilMax = item.nextOilChangeOdometerMax ?? (item.nextOilChangeOdometerMin ? null : item.nextOilChangeOdometer);

    if (oilMin || oilMax) {
      const displayRange =
        oilMin && oilMax && oilMin !== oilMax
          ? `${oilMin.toLocaleString()} - ${oilMax.toLocaleString()} km`
          : `${(oilMin || oilMax).toLocaleString()} km`;

      reminders.push({
        id: `${item.id || item._id}-oil`,
        type: "oil_change",
        title: item.title,
        vehicleName,
        targetOdometer: oilMin || oilMax || 0,
        displayRange,
        label: "Next Oil Change",
      });
    }

    // 2. Service Target Range
    const serviceMin = item.nextServiceOdometerMin ?? (item.nextServiceOdometerMax ? null : item.nextServiceOdometer);
    const serviceMax = item.nextServiceOdometerMax ?? (item.nextServiceOdometerMin ? null : item.nextServiceOdometer);

    if (serviceMin || serviceMax) {
      const displayRange =
        serviceMin && serviceMax && serviceMin !== serviceMax
          ? `${serviceMin.toLocaleString()} - ${serviceMax.toLocaleString()} km`
          : `${(serviceMin || serviceMax).toLocaleString()} km`;

      reminders.push({
        id: `${item.id || item._id}-service`,
        type: "service",
        title: item.title,
        vehicleName,
        targetOdometer: serviceMin || serviceMax || 0,
        displayRange,
        label: "Next Service",
      });
    }
  });

  reminders.sort((a, b) => a.targetOdometer - b.targetOdometer);

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Upcoming Service Reminders</CardTitle>
              <CardDescription className="text-xs">Scheduled oil changes and periodic maintenance odometer ranges</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs border-amber-500/30 text-amber-500 bg-amber-500/10">
            {reminders.length} Reminders
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {reminders.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {reminders.map((rem) => {
              const isOil = rem.type === "oil_change";
              return (
                <div
                  key={rem.id}
                  className="flex flex-col justify-between rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        {isOil ? (
                          <Droplet className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <Wrench className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        )}
                        <p className="text-xs font-semibold text-muted-foreground">{rem.vehicleName}</p>
                      </div>
                      <h4 className="font-bold text-sm text-foreground line-clamp-1">{rem.title}</h4>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] gap-1 shrink-0 ${
                        isOil
                          ? "border-amber-500/30 text-amber-500 bg-amber-500/10"
                          : "border-blue-500/30 text-blue-400 bg-blue-500/10"
                      }`}
                    >
                      {rem.label}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground pt-1 border-t border-border/40">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-foreground/70" />
                      <span>
                        Target Range: <strong className="text-foreground font-mono">{rem.displayRange}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-dashed border-border/40 bg-secondary/10">
            <Wrench className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-semibold text-foreground">No Upcoming Service Reminders</p>
            <p className="text-xs text-muted-foreground max-w-sm mt-0.5">
              When logging maintenance, set target service or oil change odometer ranges to track reminders!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
