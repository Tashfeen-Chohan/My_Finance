"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gauge, AlertTriangle, Fuel, Settings2, Sparkles, ShieldCheck } from "lucide-react";
import { DEFAULT_PREFERENCES } from "@/constants/preferences";

export function FuelReminderCard({
  expenses = [],
  preferences = DEFAULT_PREFERENCES,
  onOpenPreferences,
}) {
  // Find latest unlocked FULL TANK refill entry
  const latestRefill = expenses.find((item) => !item.isLocked && item.isFullTank);

  if (!latestRefill) {
    return (
      <Card className="border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden rounded-2xl shadow-xl">
        <CardContent className="p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-3">
            <Fuel className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">Fuel Reminders Active</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4">
            Log an unlocked Full Tank fuel refill entry with an odometer reading to activate live fuel range targets.
          </p>
          <Button
            variant="outline"
            onClick={onOpenPreferences}
            className="gap-2 text-xs font-semibold rounded-xl border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Set Range Preferences ({preferences?.fullTankDistance || DEFAULT_PREFERENCES.fullTankDistance} km / {preferences?.reserveDistance || DEFAULT_PREFERENCES.reserveDistance} km)
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Calculation parameters
  const fullTankDistance = Number(preferences?.fullTankDistance) || DEFAULT_PREFERENCES.fullTankDistance;
  const reserveDistance = Number(preferences?.reserveDistance) || DEFAULT_PREFERENCES.reserveDistance;

  const reserveRange = Math.max(1, fullTankDistance - reserveDistance);

  // Target Odometers
  const currentOdometer = Number(latestRefill.odometer || 0);
  const expectedReserveOdometer = currentOdometer + reserveRange;
  const expectedEmptyOdometer = currentOdometer + fullTankDistance;

  // Percentages for status bar
  const reservePercent = Math.min(
    100,
    Math.max(0, Math.round(((fullTankDistance - reserveDistance) / fullTankDistance) * 100))
  );

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden rounded-2xl shadow-xl">
      <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-secondary/10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-md shadow-amber-500/5">
              <Sparkles className="h-5.5 w-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                  Fuel Tank & Reserve Targets
                </CardTitle>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-semibold gap-1 hidden sm:inline-flex">
                  <ShieldCheck className="h-3 w-3" />
                  Full Tank Active
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Target odometer points from latest full tank refill ({currentOdometer.toLocaleString()} km)
              </CardDescription>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenPreferences}
            className="gap-1.5 text-xs font-semibold rounded-xl border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 shrink-0"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Range Settings</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Progress Range Meter Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-medium gap-2">
            <div className="flex items-center gap-1.5 text-emerald-500 shrink-0 min-w-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-bold whitespace-nowrap">
                Full Tank <span className="hidden sm:inline">Range</span> ({fullTankDistance} km)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-500 shrink-0 min-w-0">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">
                Reserve <span className="hidden sm:inline">Threshold</span> ({reserveDistance} km)
              </span>
            </div>
          </div>

          {/* Visual Range Bar */}
          <div className="relative h-3 w-full rounded-full bg-slate-800/40 overflow-hidden flex border border-border/30">
            <div
              style={{ width: `${reservePercent}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            />
            <div
              style={{ width: `${100 - reservePercent}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-rose-500"
            />
          </div>
        </div>

        {/* Projections Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Expected Reserve Card */}
          <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-3.5 space-y-2 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Expected Reserve Odometer</span>
              </div>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] font-mono">
                +{reserveRange} km
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Gauge className="h-3.5 w-3.5 text-amber-500/80" />
                Target Reading:
              </span>
              <span className="font-mono font-extrabold text-foreground text-sm sm:text-base">
                {expectedReserveOdometer.toLocaleString()} km
              </span>
            </div>
          </div>

          {/* Expected Tank Empty Card */}
          <div className="rounded-xl border-2 border-rose-500/30 bg-rose-500/5 p-3.5 space-y-2 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
                <Fuel className="h-4 w-4 shrink-0" />
                <span>Expected Empty Odometer</span>
              </div>
              <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px] font-mono">
                +{fullTankDistance} km
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Gauge className="h-3.5 w-3.5 text-rose-500/80" />
                Target Reading:
              </span>
              <span className="font-mono font-extrabold text-foreground text-sm sm:text-base">
                {expectedEmptyOdometer.toLocaleString()} km
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
