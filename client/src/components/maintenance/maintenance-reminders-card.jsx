"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Gauge, Wrench, CheckCircle } from "lucide-react";

export function MaintenanceRemindersCard({ upcomingServices = [], vehicles = [] }) {
  const getVehicleName = (vehicleId) => {
    const v = vehicles.find((item) => (item.id || item._id) === vehicleId);
    return v ? v.name : "Vehicle";
  };

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
              <CardDescription className="text-xs">Scheduled oil changes and periodic maintenance odometer targets</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs border-amber-500/30 text-amber-500 bg-amber-500/10">
            {upcomingServices.length} Reminders
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {upcomingServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingServices.map((item) => (
              <div
                key={item.id || item._id}
                className="flex flex-col justify-between rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-muted-foreground">{getVehicleName(item.vehicleId)}</p>
                    <h4 className="font-bold text-sm text-foreground line-clamp-1">{item.title}</h4>
                  </div>
                  <Badge variant="outline" className="text-[10px] gap-1 shrink-0">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    Target Set
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground pt-1 border-t border-border/40">
                  {item.nextServiceOdometer && (
                    <div className="flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-amber-500" />
                      <span>Due Odometer: <strong className="text-foreground font-mono">{item.nextServiceOdometer.toLocaleString()} km</strong></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-dashed border-border/40 bg-secondary/10">
            <Wrench className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-semibold text-foreground">No Upcoming Service Reminders</p>
            <p className="text-xs text-muted-foreground max-w-sm mt-0.5">
              When logging maintenance, set target next service odometer to track reminders!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
