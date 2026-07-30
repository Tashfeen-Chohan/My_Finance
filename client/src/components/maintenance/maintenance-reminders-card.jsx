"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadgeSkeleton, MaintenanceRemindersSkeleton } from "@/components/skeletons";
import { Bell, Gauge, Wrench, Droplet, Car } from "lucide-react";

export function MaintenanceRemindersCard({ upcomingServices = [], vehicles = [], isLoading = false }) {
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
    <Card className="border-border/50 bg-card/60 backdrop-blur-2xl shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 pt-5 px-4 sm:px-6 border-b border-border/30 bg-secondary/10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                Upcoming Service Reminders
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Scheduled oil changes & periodic service targets
              </CardDescription>
            </div>
          </div>
          {isLoading ? (
            <BadgeSkeleton className="w-16" />
          ) : (
            <Badge
              variant="outline"
              className="font-mono text-xs border-amber-500/30 text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full"
            >
              {reminders.length} Active
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {isLoading ? (
          <MaintenanceRemindersSkeleton />
        ) : reminders.length > 0 ? (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {reminders.map((rem) => {
              const isOil = rem.type === "oil_change";
              return (
                <div
                  key={rem.id}
                  className="flex flex-col justify-between rounded-2xl border border-border/50 bg-background/60 p-4 space-y-3.5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <Car className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                        <span>{rem.vehicleName}</span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground line-clamp-1">{rem.title}</h4>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[10px] sm:text-xs font-semibold gap-1 shrink-0 px-2 py-0.5 rounded-lg ${
                        isOil
                          ? "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                          : "border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10"
                      }`}
                    >
                      {isOil ? (
                        <Droplet className="h-3 w-3 shrink-0" />
                      ) : (
                        <Wrench className="h-3 w-3 shrink-0" />
                      )}
                      <span>{rem.label}</span>
                    </Badge>
                  </div>

                  <div className="rounded-xl border border-border/40 bg-secondary/30 p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Gauge className="h-4 w-4 text-foreground/70 shrink-0" />
                      <span className="font-medium">Target Range:</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-foreground bg-background/80 px-2 py-1 rounded-md border border-border/40">
                      {rem.displayRange}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-dashed border-border/40 bg-secondary/10">
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
