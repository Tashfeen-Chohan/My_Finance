"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { BadgeSkeleton, MaintenanceRemindersSkeleton } from "@/components/skeletons";
import { Bell, Gauge, Wrench, Droplet, Fuel, AlertTriangle } from "lucide-react";

export function DashboardRemindersCard({ upcomingServices = [], isLoading = false }) {
  const maintenanceItems = Array.isArray(upcomingServices)
    ? upcomingServices
    : upcomingServices?.maintenance || [];
  const fuelReminder = Array.isArray(upcomingServices) ? null : upcomingServices?.fuel;

  const reminders = [];

  // 1. Process Fuel Tank & Reserve Reminders
  if (fuelReminder) {
    if (fuelReminder.expectedReserveOdometer) {
      reminders.push({
        id: "fuel-reserve-target",
        type: "fuel_reserve",
        title: "Expected Reserve Odometer",
        targetOdometer: fuelReminder.expectedReserveOdometer,
        displayRange: `${fuelReminder.expectedReserveOdometer.toLocaleString()} km`,
        label: "Fuel Reserve Target",
      });
    }
    if (fuelReminder.expectedEmptyOdometer) {
      reminders.push({
        id: "fuel-empty-target",
        type: "fuel_empty",
        title: "Expected Tank Empty",
        targetOdometer: fuelReminder.expectedEmptyOdometer,
        displayRange: `${fuelReminder.expectedEmptyOdometer.toLocaleString()} km`,
        label: "Tank Empty Target",
      });
    }
  }

  // 2. Process Maintenance Reminders (Oil Change & Service Targets)
  maintenanceItems.forEach((item) => {
    // Oil Change Target Range
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
        targetOdometer: oilMin || oilMax || 0,
        displayRange,
        label: "Next Oil Change",
      });
    }

    // Service Target Range
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
                Upcoming Vehicle Reminders
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Scheduled fuel range limits & maintenance service targets
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
          <div className="flex flex-col gap-3">
            {reminders.map((rem) => {
              const isOil = rem.type === "oil_change";
              const isFuelReserve = rem.type === "fuel_reserve";
              const isFuelEmpty = rem.type === "fuel_empty";

              let cardStyle = "border-sky-500/20 bg-sky-500/5 hover:border-sky-500/40";
              let iconBg = "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
              let badgeStyle = "border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10";

              if (isFuelReserve) {
                cardStyle = "border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40";
                iconBg = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                badgeStyle = "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10";
              } else if (isOil) {
                cardStyle = "border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40";
                iconBg = "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
                badgeStyle = "border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10";
              } else if (isFuelEmpty) {
                cardStyle = "border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40";
                iconBg = "bg-rose-500/10 text-rose-500 border-rose-500/20";
                badgeStyle = "border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10";
              }

              return (
                <div
                  key={rem.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border ${cardStyle} p-3.5 sm:p-4 gap-3 shadow-sm hover:shadow-md transition-all`}
                >
                  {/* Left Details: Icon, Title & Reminder Type */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-sm ${iconBg}`}
                    >
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

                    <div className="space-y-1 min-w-0 flex-1">
                      <Tooltip content={rem.title} side="top">
                        <h4 className="font-bold text-xs sm:text-sm text-foreground truncate cursor-pointer">
                          {rem.title}
                        </h4>
                      </Tooltip>

                      <div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold shrink-0 px-2 py-0.5 rounded-md ${badgeStyle}`}
                        >
                          {rem.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Right Target Range Badge */}
                  <div className="rounded-xl border border-border/40 bg-background/80 backdrop-blur-md px-3 py-1.5 flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Gauge className="h-4 w-4 text-foreground/70 shrink-0" />
                      <span className="font-medium">Target:</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-foreground bg-secondary/60 px-2.5 py-1 rounded-md border border-border/40">
                      {rem.displayRange}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center rounded-2xl border border-dashed border-border/40 bg-secondary/10">
            <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-semibold text-foreground">No Upcoming Vehicle Reminders</p>
            <p className="text-xs text-muted-foreground max-w-sm mt-0.5">
              Log full tank refills or set maintenance service odometer targets to populate reminders!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
