"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Fuel, Settings2 } from "lucide-react";
import { DEFAULT_PREFERENCES } from "@/constants/preferences";
import { FuelReminderCardSkeleton } from "@/components/skeletons";

export function FuelReminderCard({
  expenses = [],
  preferences = DEFAULT_PREFERENCES,
  isLoading = false,
  onOpenPreferences,
}) {
  if (isLoading) {
    return <FuelReminderCardSkeleton />;
  }

  const latestRefill = expenses.find((item) => !item.isLocked && item.isFullTank);

  if (!latestRefill) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-3">
            <Fuel className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Fuel Range Reminders</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4">
            Log an unlocked Full Tank refill with an odometer reading to track reserve and empty range targets.
          </p>
          <Button variant="outline" size="sm" onClick={onOpenPreferences} className="gap-2 text-xs">
            <Settings2 className="h-3.5 w-3.5" />
            Range Preferences ({preferences?.fullTankDistance || DEFAULT_PREFERENCES.fullTankDistance} km / {preferences?.reserveDistance || DEFAULT_PREFERENCES.reserveDistance} km)
          </Button>
        </CardContent>
      </Card>
    );
  }

  const fullTankDistance = Number(preferences?.fullTankDistance) || DEFAULT_PREFERENCES.fullTankDistance;
  const reserveDistance = Number(preferences?.reserveDistance) || DEFAULT_PREFERENCES.reserveDistance;
  const reserveRange = Math.max(1, fullTankDistance - reserveDistance);

  const currentOdometer = Number(latestRefill.odometer || 0);
  const expectedReserveOdometer = currentOdometer + reserveRange;
  const expectedEmptyOdometer = currentOdometer + fullTankDistance;

  const reservePercent = Math.min(
    100,
    Math.max(0, Math.round(((fullTankDistance - reserveDistance) / fullTankDistance) * 100))
  );

  return (
    <Card>
      <CardHeader className="p-5 pb-4 border-b border-border flex flex-row items-center justify-between gap-3 space-y-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold truncate">Fuel Range Targets</CardTitle>
            <Badge variant="secondary" className="text-[10px] font-medium hidden sm:inline-flex">
              Full Tank Active
            </Badge>
          </div>
          <CardDescription className="text-xs mt-0.5 truncate">
            Based on refill at <span className="tabular-nums font-medium">{currentOdometer.toLocaleString()} km</span>
          </CardDescription>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenPreferences}
          className="gap-1.5 text-xs shrink-0"
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Full Tank ({fullTankDistance} km)</span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              <AlertTriangle className="h-3.5 w-3.5" />
              Reserve ({reserveDistance} km)
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden flex">
            <div style={{ width: `${reservePercent}%` }} className="h-full bg-teal-500" />
            <div style={{ width: `${100 - reservePercent}%` }} className="h-full bg-amber-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-secondary/30 p-3.5 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Expected Reserve</p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium tabular-nums">
                +{reserveRange} km
              </p>
            </div>
            <span className="text-sm sm:text-base font-bold text-foreground tabular-nums">
              {expectedReserveOdometer.toLocaleString()} km
            </span>
          </div>

          <div className="rounded-xl border border-border bg-secondary/30 p-3.5 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Expected Empty</p>
              <p className="text-[11px] text-destructive font-medium tabular-nums">
                +{fullTankDistance} km
              </p>
            </div>
            <span className="text-sm sm:text-base font-bold text-foreground tabular-nums">
              {expectedEmptyOdometer.toLocaleString()} km
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
