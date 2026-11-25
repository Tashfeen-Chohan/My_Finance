"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BadgeSkeleton, MaintenanceRemindersSkeleton } from "@/components/skeletons";
import { Bell, Wrench, Droplet, Fuel, AlertTriangle } from "lucide-react";

export function DashboardRemindersCard({ upcomingServices = [], isLoading = false }) {
  const maintenanceItems = Array.isArray(upcomingServices)
    ? upcomingServices
    : upcomingServices?.maintenance || [];
  const fuelReminder = Array.isArray(upcomingServices) ? null : upcomingServices?.fuel;

  const reminders = [];

  if (fuelReminder) {
    if (fuelReminder.expectedReserveOdometer) {
      reminders.push({
        id: "fuel-reserve-target",
        type: "fuel_reserve",
        title: "Expected Reserve Odometer",
        targetOdometer: fuelReminder.expectedReserveOdometer,
        displayRange: `${fuelReminder.expectedReserveOdometer.toLocaleString()} km`,
        label: "Fuel Reserve",
      });
    }
    if (fuelReminder.expectedEmptyOdometer) {
      reminders.push({
        id: "fuel-empty-target",
        type: "fuel_empty",
        title: "Expected Tank Empty",
        targetOdometer: fuelReminder.expectedEmptyOdometer,
        displayRange: `${fuelReminder.expectedEmptyOdometer.toLocaleString()} km`,
        label: "Tank Empty",
      });
    }
  }

  maintenanceItems.forEach((item) => {
    const maintenanceId = item.id || item._id;

    const oilMin = item.nextOilChangeOdometerMin ?? (item.nextOilChangeOdometerMax ? null : item.nextOilChangeOdometer);
    const oilMax = item.nextOilChangeOdometerMax ?? (item.nextOilChangeOdometerMin ? null : item.nextOilChangeOdometer);

    if (!item.isOilChangeCompleted && (oilMin || oilMax)) {
      const displayRange =
        oilMin && oilMax && oilMin !== oilMax
          ? `${oilMin.toLocaleString()} – ${oilMax.toLocaleString()} km`
          : `${(oilMin || oilMax).toLocaleString()} km`;

      reminders.push({
        id: `${maintenanceId}-oil`,
        maintenanceId,
        type: "oil_change",
        title: item.title,
        targetOdometer: oilMin || oilMax || 0,
        displayRange,
        label: "Oil Change",
      });
    }

    const serviceMin = item.nextServiceOdometerMin ?? (item.nextServiceOdometerMax ? null : item.nextServiceOdometer);
    const serviceMax = item.nextServiceOdometerMax ?? (item.nextServiceOdometerMin ? null : item.nextServiceOdometer);

    if (!item.isServiceCompleted && (serviceMin || serviceMax)) {
      const displayRange =
        serviceMin && serviceMax && serviceMin !== serviceMax
          ? `${serviceMin.toLocaleString()} – ${serviceMax.toLocaleString()} km`
          : `${(serviceMin || serviceMax).toLocaleString()} km`;

      reminders.push({
        id: `${maintenanceId}-service`,
        maintenanceId,
        type: "service",
        title: item.title,
        targetOdometer: serviceMin || serviceMax || 0,
        displayRange,
        label: "Service",
      });
    }
  });

  reminders.sort((a, b) => a.targetOdometer - b.targetOdometer);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-5 pb-3.5 border-b border-border flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Upcoming Reminders</CardTitle>
          <CardDescription className="text-xs mt-0.5">Fuel range and service odometer targets</CardDescription>
        </div>
        {isLoading ? (
          <BadgeSkeleton className="w-16" />
        ) : (
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {reminders.length} active
          </span>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4">
            <MaintenanceRemindersSkeleton />
          </div>
        ) : reminders.length > 0 ? (
          <div className="divide-y divide-border">
            {reminders.map((rem) => {
              const isOil = rem.type === "oil_change";
              const isFuelReserve = rem.type === "fuel_reserve";
              const isFuelEmpty = rem.type === "fuel_empty";

              let iconStyle = "bg-sky-500/10 text-sky-600 dark:text-sky-400";
              if (isFuelReserve) iconStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400";
              else if (isFuelEmpty) iconStyle = "bg-destructive/10 text-destructive";

              return (
                <div
                  key={rem.id}
                  className="flex items-center justify-between px-5 py-3.5 gap-3 hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconStyle}`}>
                      {isFuelEmpty ? (
                        <Fuel className="h-4 w-4" />
                      ) : isFuelReserve ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : isOil ? (
                        <Droplet className="h-4 w-4" />
                      ) : (
                        <Wrench className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm text-foreground truncate">{rem.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{rem.label}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 text-xs sm:text-sm font-semibold text-foreground tabular-nums">
                    {rem.displayRange}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Bell className="h-7 w-7 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium text-foreground">No upcoming reminders</p>
            <p className="text-xs text-muted-foreground max-w-xs mt-1">
              Log full tank refills or set service odometer targets to see reminders here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
