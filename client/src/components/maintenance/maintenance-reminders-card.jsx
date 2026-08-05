"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { BadgeSkeleton, MaintenanceRemindersSkeleton } from "@/components/skeletons";
import { Bell, Gauge, Wrench, Droplet, Car } from "lucide-react";

export function MaintenanceRemindersCard({ upcomingServices = [], vehicles = [], isLoading = false }) {
  const getVehicleName = (vehicleId) => {
    const vId = vehicleId?._id || vehicleId;
    const v = vehicles.find((item) => (item.id || item._id) === vId);
    return v ? v.name : "Vehicle";
  };

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
      <CardHeader className="pb-3.5 pt-5 px-4 sm:px-6 border-b border-border/30 bg-secondary/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm backdrop-blur-md">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
                Upcoming Service Reminders
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Scheduled oil changes & maintenance odometer targets
              </CardDescription>
            </div>
          </div>
          {isLoading ? (
            <BadgeSkeleton className="w-16" />
          ) : (
            <Badge
              variant="outline"
              className="font-mono text-xs border-amber-500/30 text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full shadow-sm"
            >
              {reminders.length} Reminders
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {isLoading ? (
          <MaintenanceRemindersSkeleton />
        ) : reminders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reminders.map((rem) => {
              const isOil = rem.type === "oil_change";

              const theme = isOil
                ? {
                    card: "border-purple-500/25 bg-purple-500/[0.03] hover:border-purple-500/50 hover:bg-purple-500/[0.06]",
                    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
                    badge: "border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10",
                  }
                : {
                    card: "border-sky-500/25 bg-sky-500/[0.03] hover:border-sky-500/50 hover:bg-sky-500/[0.06]",
                    iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
                    badge: "border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10",
                  };

              return (
                <div
                  key={rem.id}
                  className={`flex flex-col justify-between rounded-2xl border ${theme.card} p-4 sm:p-5 gap-3.5 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-md`}
                >
                  {/* Card Header: Icon, Vehicle Name, Title & Badge */}
                  <div className="flex items-start justify-between gap-3 min-w-0">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm ${theme.iconBg}`}>
                        {isOil ? <Droplet className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Car className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                          <span className="truncate">{rem.vehicleName}</span>
                        </div>
                        <Tooltip content={rem.title} side="top">
                          <h4 className="font-extrabold text-sm sm:text-base text-foreground cursor-pointer tracking-tight break-words">
                            {rem.title}
                          </h4>
                        </Tooltip>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[10px] sm:text-xs font-bold shrink-0 px-2.5 py-0.5 rounded-lg shadow-sm ${theme.badge}`}
                    >
                      {rem.label}
                    </Badge>
                  </div>

                  {/* Target Range Section Banner without background box on gauge icon */}
                  <div className="rounded-xl border border-border/40 bg-card/80 backdrop-blur-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                      <Gauge className="h-4 w-4 text-foreground/70 shrink-0" />
                      <span className="font-semibold text-xs text-muted-foreground/90">Target Range</span>
                    </div>

                    <span className="font-mono text-xs sm:text-sm font-extrabold text-foreground bg-secondary/80 px-2.5 py-1 rounded-lg border border-border/40 shadow-sm w-fit self-start sm:self-auto whitespace-nowrap">
                      {rem.displayRange}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-border/40 bg-secondary/10">
            <Wrench className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-bold text-foreground">No Upcoming Service Reminders</p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              When logging maintenance, set target service or oil change odometer ranges to track reminders!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
