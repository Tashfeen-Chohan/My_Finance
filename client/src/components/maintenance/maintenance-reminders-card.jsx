"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MaintenanceRemindersSkeleton } from "@/components/skeletons";
import { Wrench, Droplet, CheckCircle2, RotateCcw, Check, Gauge } from "lucide-react";

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

    const oilMin = item.nextOilChangeOdometerMin ?? (item.nextOilChangeOdometerMax ? null : item.nextOilChangeOdometer);
    const oilMax = item.nextOilChangeOdometerMax ?? (item.nextOilChangeOdometerMin ? null : item.nextOilChangeOdometer);

    if (oilMin || oilMax) {
      const displayRange =
        oilMin && oilMax && oilMin !== oilMax
          ? `${oilMin.toLocaleString()} – ${oilMax.toLocaleString()} km`
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

    const serviceMin = item.nextServiceOdometerMin ?? (item.nextServiceOdometerMax ? null : item.nextServiceOdometer);
    const serviceMax = item.nextServiceOdometerMax ?? (item.nextServiceOdometerMin ? null : item.nextServiceOdometer);

    if (serviceMin || serviceMax) {
      const displayRange =
        serviceMin && serviceMax && serviceMin !== serviceMax
          ? `${serviceMin.toLocaleString()} – ${serviceMax.toLocaleString()} km`
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
    <Card className="overflow-hidden">
      <CardHeader className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Service Reminders</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Scheduled oil changes and maintenance odometer targets
          </CardDescription>
        </div>

        <div className="grid grid-cols-2 sm:inline-flex items-center p-1 rounded-lg bg-secondary text-xs w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setTab("active")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer text-center ${
              tab === "active"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Active ({activeReminders.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("completed")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer text-center ${
              tab === "completed"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Completed ({completedReminders.length})
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-5 bg-secondary/15 dark:bg-black/25">
        {isLoading ? (
          <MaintenanceRemindersSkeleton />
        ) : displayedReminders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {displayedReminders.map((rem) => {
              const isOil = rem.type === "oil_change";

              return (
                <div
                  key={rem.id}
                  className="flex flex-col justify-between rounded-xl border-2 border-slate-200 dark:border-slate-700/90 bg-card p-3.5 sm:p-4 gap-3 shadow-xs transition-colors hover:border-sky-500/40"
                >
                  {/* Top Row: Icon, Vehicle + Job Title, Reminder Type */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          rem.isCompleted
                            ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                            : "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                        }`}
                      >
                        {rem.isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : isOil ? (
                          <Droplet className="h-4 w-4" />
                        ) : (
                          <Wrench className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm text-foreground truncate">
                          {rem.vehicleName}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {rem.title}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-medium shrink-0 ${
                        rem.isCompleted
                          ? "text-teal-600 dark:text-teal-400"
                          : "text-sky-600 dark:text-sky-400"
                      }`}
                    >
                      {rem.isCompleted ? `${rem.label} · Done` : rem.label}
                    </Badge>
                  </div>

                  {/* Bottom Bar: Target Odometer + Action */}
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-secondary/40 px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Gauge className="h-3 w-3 shrink-0" />
                        <span>Target Odometer</span>
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-foreground tabular-nums truncate mt-0.5">
                        {rem.displayRange}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {rem.isCompleted ? (
                        onUndoReminder && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUndoReminder(rem.maintenanceId, rem.type);
                            }}
                            className="h-8 gap-1.5 text-xs bg-card"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
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
                            className="h-8 gap-1.5 text-xs bg-card hover:border-teal-500/40"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                            Mark Done
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-card">
            <Wrench className="h-7 w-7 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium text-foreground">
              {tab === "active" ? "No active reminders" : "No completed reminders"}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              {tab === "active"
                ? "Set target service or oil change odometer ranges when logging maintenance."
                : "Completed service reminders will appear here."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
