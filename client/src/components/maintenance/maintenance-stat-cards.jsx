"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Droplet, DollarSign, CalendarCheck } from "lucide-react";

export function MaintenanceStatCards({ maintenanceLogs = [], upcomingServices = [] }) {
  // 1. Total Cost
  const totalCost = maintenanceLogs.reduce((acc, item) => acc + (Number(item.cost ?? item.totalCost) || 0), 0);

  // 2. Oil changes count
  const oilChangesCount = maintenanceLogs.filter(
    (item) => item.category === "oil_change" || item.category === "service_and_oil_change"
  ).length;

  // 3. Regular services / repairs count
  const servicesCount = maintenanceLogs.filter(
    (item) =>
      item.category === "service" ||
      item.category === "repair" ||
      item.category === "part_replacement" ||
      item.category === "service_and_oil_change"
  ).length;

  // 4. Upcoming reminders count
  const upcomingCount = upcomingServices.reduce((acc, item) => {
    let count = 0;
    const hasOil = item.nextOilChangeOdometerMin || item.nextOilChangeOdometerMax || item.nextOilChangeOdometer;
    const hasService = item.nextServiceOdometerMin || item.nextServiceOdometerMax || item.nextServiceOdometer;
    if (hasOil) count++;
    if (hasService) count++;
    return acc + count;
  }, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Maintenance Cost */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Expense</p>
            <h3 className="text-2xl font-bold text-foreground">
              PKR {totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Oil Changes Logged */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Droplet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Oil Changes</p>
            <h3 className="text-2xl font-bold text-foreground">{oilChangesCount} Logs</h3>
          </div>
        </CardContent>
      </Card>

      {/* Services & Repairs */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Services & Repairs</p>
            <h3 className="text-2xl font-bold text-foreground">{servicesCount} Jobs</h3>
          </div>
        </CardContent>
      </Card>

      {/* Reminders Scheduled */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Service Reminders</p>
            <h3 className="text-2xl font-bold text-foreground">{upcomingCount} Active</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
