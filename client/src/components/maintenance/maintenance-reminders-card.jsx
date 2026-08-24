"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MaintenanceRemindersSkeleton } from "@/components/skeletons";
import { Bell, Gauge, Wrench, Droplet, CheckCircle2, RotateCcw, Check } from "lucide-react";

export function MaintenanceRemindersCard({
  upcomingServices = [],
  vehicles = [],
  isLoading = false,
  onCompleteReminder,
  onUndoReminder,
}) {
  const [tab, setTab] = useState("active");

  const getVehicleName = (vehicleId) => {
    const vId = vehicleId?._id || vehicleId;
    const v = vehicles.find((item) => (item.id || item._id) === vId);
    return v ? v.name : "Vehicle";
  };

  const activeReminders = [];
  const completedReminders = [];

  upcomingServices.forEach((item) => {
    const vehicleName = getVehicleName(item.vehicleId);
    const maintenanceId = item.id || item._id;

    // 1. Oil Change Target Range
    const oilMin = item.nextOilChangeOdometerMin ?? (item.nextOilChangeOdometerMax ? null : item.nextOilChangeOdometer);
    const oilMax = item.nextOilChangeOdometerMax ?? (item.nextOilChangeOdometerMin ? null : item.nextOilChangeOdometer);

    if (oilMin || oilMax) {
      const displayRange =
        oilMin && oilMax && oilMin !== oilMax
          ? `${oilMin.toLocaleString()} - ${oilMax.toLocaleString()} km`
          : `${(oilMin || oilMax).toLocaleString()} km`;

      const obj = {
        id: `${maintenanceId}-oil`,
        maintenanceId,
        type: "oil_change",
        title: item.title,
        vehicleName,
        targetOdometer: oilMin || oilMax || 0,
        displayRange,
        label: "Next Oil Change",
        isCompleted: Boolean(item.isOilChangeCompleted),
      };

      if (item.isOilChangeCompleted) {
        completedReminders.push(obj);
      } else {
        activeReminders.push(obj);
      }
    }

    // 2. Service Target Range
    const serviceMin = item.nextServiceOdometerMin ?? (item.nextServiceOdometerMax ? null : item.nextServiceOdometer);
    const serviceMax = item.nextServiceOdometerMax ?? (item.nextServiceOdometerMin ? null : item.nextServiceOdometer);

    if (serviceMin || serviceMax) {
      const displayRange =
        serviceMin && serviceMax && serviceMin !== serviceMax
          ? `${serviceMin.toLocaleString()} - ${serviceMax.toLocaleString()} km`
          : `${(serviceMin || serviceMax).toLocaleString()} km`;

      const obj = {
        id: `${maintenanceId}-service`,
        maintenanceId,
        type: "service",
        title: item.title,
        vehicleName,
        targetOdometer: serviceMin || serviceMax || 0,
        displayRange,
        label: "Next Service",
        isCompleted: Boolean(item.isServiceCompleted),
      };

      if (item.isServiceCompleted) {
        completedReminders.push(obj);
      } else {
        activeReminders.push(obj);
      }
    }
  });

  activeReminders.sort((a, b) => a.targetOdometer - b.targetOdometer);
  completedReminders.sort((a, b) => a.targetOdometer - b.targetOdometer);

  const displayedReminders = tab === "active" ? activeReminders : completedReminders;

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
                Service Reminders
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Scheduled oil changes & maintenance odometer targets
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-secondary/80 border border-border/50 text-xs font-semibold">
              <button
                onClick={() => setTab("active")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  tab === "active"
                    ? "bg-amber-500/20 text-amber-500 font-bold border border-amber-500/30 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Active ({activeReminders.length})
              </button>
              <button
                onClick={() => setTab("completed")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  tab === "completed"
                    ? "bg-emerald-500/20 text-emerald-500 font-bold border border-emerald-500/30 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Completed ({completedReminders.length})
              </button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {isLoading ? (
          <MaintenanceRemindersSkeleton />
        ) : displayedReminders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedReminders.map((rem) => {
              const isOil = rem.type === "oil_change";

              const theme = rem.isCompleted
                ? {
                    card: "border-emerald-500/20 bg-emerald-500/[0.02] hover:border-emerald-500/40",
                    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                    badge: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
                  }
                : isOil
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
                  {/* Card Header: Icon, Vehicle Name & Badge */}
                  <div className="flex items-center justify-between gap-2.5 sm:gap-3 min-w-0">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm ${theme.iconBg}`}>
                        {rem.isCompleted ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : isOil ? <Droplet className="h-4 w-4 sm:h-5 sm:w-5" /> : <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-sm sm:text-base text-foreground tracking-tight truncate">
                          {rem.vehicleName}
                        </h4>
                        {/* Label Badge below vehicle name on mobile */}
                        <div className="sm:hidden mt-1">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${theme.badge}`}
                          >
                            {rem.isCompleted ? `${rem.label} (Done)` : rem.label}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Label Badge on right side for desktop */}
                    <Badge
                      variant="outline"
                      className={`hidden sm:inline-flex text-xs font-bold shrink-0 px-2.5 py-0.5 rounded-lg shadow-sm ${theme.badge}`}
                    >
                      {rem.isCompleted ? `${rem.label} (Done)` : rem.label}
                    </Badge>
                  </div>

                  {/* Target Range Section Banner & Actions */}
                  <div className="rounded-xl border border-border/40 bg-card/80 backdrop-blur-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                      <Gauge className="h-4 w-4 text-foreground/70 shrink-0" />
                      <span className="font-semibold text-xs text-muted-foreground/90">Target:</span>
                      <span className="font-mono text-xs font-bold text-foreground bg-secondary/80 px-2 py-0.5 rounded-md border border-border/40 whitespace-nowrap">
                        {rem.displayRange}
                      </span>
                    </div>

                    {rem.isCompleted ? (
                      onUndoReminder && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUndoReminder(rem.maintenanceId, rem.type);
                          }}
                          className="h-8 gap-1.5 text-xs font-semibold border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-500/50 rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
                        >
                          <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
                          Undo
                        </Button>
                      )
                    ) : (
                      onCompleteReminder && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCompleteReminder(rem.maintenanceId, rem.type);
                          }}
                          className="h-8 gap-1.5 text-xs font-semibold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          Mark Done
                        </Button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-border/40 bg-secondary/10">
            <Wrench className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-bold text-foreground">
              {tab === "active" ? "No Active Service Reminders" : "No Completed Reminders Yet"}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              {tab === "active"
                ? "When logging maintenance, set target service or oil change odometer ranges to track reminders!"
                : "Completed service reminders will appear here where you can undo or view them."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
