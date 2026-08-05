"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StatValueSkeleton } from "@/components/skeletons";
import { DollarSign, Fuel, Wrench, Car } from "lucide-react";

export function DashboardKpiCards({ expenses = {}, vehicles = {}, isLoading = false }) {
  const grandTotal = expenses.grandTotalSpend || 0;
  const fuelSpend = expenses.totalFuelSpend || 0;
  const maintenanceSpend = expenses.totalMaintenanceSpend || 0;
  const totalVehicles = vehicles.total || 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Grand Total Expense */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Grand Total Spend</p>
            {isLoading ? (
              <StatValueSkeleton className="w-28" />
            ) : (
              <h3 className="text-2xl font-extrabold text-foreground">
                PKR {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </h3>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total Fuel Spend */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
            <Fuel className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fuel Spend</p>
            {isLoading ? (
              <StatValueSkeleton className="w-24" />
            ) : (
              <h3 className="text-2xl font-bold text-foreground">
                PKR {fuelSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </h3>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total Maintenance Spend */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-sm">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Maintenance Spend</p>
            {isLoading ? (
              <StatValueSkeleton className="w-24" />
            ) : (
              <h3 className="text-2xl font-bold text-foreground">
                PKR {maintenanceSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </h3>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Registered Vehicles */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Registered Garage</p>
            {isLoading ? (
              <StatValueSkeleton className="w-20" />
            ) : (
              <h3 className="text-2xl font-bold text-foreground">{totalVehicles} Vehicles</h3>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
