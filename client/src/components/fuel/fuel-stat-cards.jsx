"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Fuel, DollarSign, Gauge, TrendingUp } from "lucide-react";
import { StatValueSkeleton } from "@/components/skeletons";

export function FuelStatCards({ fuelExpenses = [], isLoading = false }) {
  // Compute analytics metrics
  const totalCost = fuelExpenses.reduce((acc, curr) => acc + (Number(curr.totalCost) || 0), 0);
  const totalVolume = fuelExpenses.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

  // Compute average fuel economy
  const validEconomies = fuelExpenses
    .map((f) => Number(f.computedEconomy))
    .filter((val) => !isNaN(val) && val > 0);

  const avgEconomy =
    validEconomies.length > 0
      ? Number((validEconomies.reduce((a, b) => a + b, 0) / validEconomies.length).toFixed(2))
      : 0;

  // Calculate overall cost per km
  const sortedByOdometer = [...fuelExpenses].sort((a, b) => (a.odometer || 0) - (b.odometer || 0));
  const minOdo = sortedByOdometer[0]?.odometer || 0;
  const maxOdo = sortedByOdometer[sortedByOdometer.length - 1]?.odometer || 0;
  const totalDistance = Math.max(0, maxOdo - minOdo);

  const costPerKm =
    totalDistance > 0 && totalCost > 0
      ? Number((totalCost / totalDistance).toFixed(2))
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Spend */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Fuel Cost</p>
            {isLoading ? (
              <StatValueSkeleton className="w-32" />
            ) : (
              <h3 className="text-2xl font-bold text-foreground truncate">
                PKR {totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </h3>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total Fuel Volume */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
            <Fuel className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Volume</p>
            {isLoading ? (
              <StatValueSkeleton className="w-32" />
            ) : (
              <h3 className="text-2xl font-bold text-foreground truncate">{totalVolume.toFixed(1)} L</h3>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Average Mileage (Fuel Economy) */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <Gauge className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Average Mileage</p>
            {isLoading ? (
              <StatValueSkeleton className="w-32" />
            ) : (
              <h3 className="text-2xl font-bold text-foreground truncate">
                {avgEconomy > 0 ? `${avgEconomy} km/L` : "N/A"}
              </h3>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cost Per Kilometer */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cost per Kilometer</p>
            {isLoading ? (
              <StatValueSkeleton className="w-32" />
            ) : (
              <h3 className="text-2xl font-bold text-foreground truncate">
                {costPerKm > 0 ? `PKR ${costPerKm}/km` : "N/A"}
              </h3>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
