"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeSkeleton, FuelLogsListSkeleton } from "@/components/skeletons";
import {
  Fuel,
  Plus,
  MapPin,
  CheckCircle2,
  Gauge,
  Calendar,
  Droplet,
  TrendingUp,
  Route,
  ChevronRight,
} from "lucide-react";

export function FuelLogsList({
  expenses = [],
  vehicles = [],
  isLoading = false,
  onView,
  onLogFuelRefill,
}) {
  const getVehicleName = (vehicleId) => {
    const vId = vehicleId?._id || vehicleId;
    const v = vehicles.find((item) => (item.id || item._id) === vId);
    return v ? v.name : "Vehicle";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 sm:p-5 border-b border-border flex flex-row items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Refill History</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Complete fuel refill logs and efficiency metrics
          </CardDescription>
        </div>

        {isLoading ? (
          <BadgeSkeleton className="h-6 w-16" />
        ) : (
          <Badge variant="secondary" className="text-xs font-medium tabular-nums shrink-0">
            {expenses.length} {expenses.length === 1 ? "entry" : "entries"}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-3 sm:p-6 bg-secondary/15 dark:bg-black/25">
        {isLoading ? (
          <FuelLogsListSkeleton />
        ) : expenses.length > 0 ? (
          <div className="space-y-4 md:space-y-8">
            {expenses.map((expense) => {
              const dateStr = expense.date
                ? new Date(expense.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A";

              const costFormatted = Number(expense.totalCost ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              });

              return (
                <div
                  key={expense.id || expense._id}
                  onClick={() => onView?.(expense)}
                  className="group rounded-xl border-2 border-slate-200 dark:border-slate-700/90 bg-card hover:border-teal-500/50 active:bg-secondary/30 shadow-sm transition-all cursor-pointer overflow-hidden md:pb-2"
                >
                  {/* Card Top Bar */}
                  <div className="px-3.5 py-3 sm:px-4 sm:py-3.5 bg-secondary/30 border-b border-border space-y-2.5">
                    {/* Row 1: Icon + Vehicle Name + Full Tank + Total Cost */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                          <Fuel className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">
                            {getVehicleName(expense.vehicleId)}
                          </h4>
                          {expense.isFullTank && (
                            <>
                              {/* Mobile: Tick only */}
                              <CheckCircle2
                                className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 sm:hidden"
                                aria-label="Full Tank"
                              />
                              {/* Desktop: Full Tank badge */}
                              <Badge
                                variant="secondary"
                                className="hidden sm:inline-flex text-[11px] font-medium gap-1 text-teal-600 dark:text-teal-400 px-2 py-0 shrink-0"
                              >
                                <CheckCircle2 className="h-3 w-3 shrink-0" />
                                Full Tank
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <p className="hidden sm:block text-[10px] text-muted-foreground uppercase tracking-wider font-medium leading-none mb-0.5">
                            Total
                          </p>
                          <p className="text-sm sm:text-base font-bold text-foreground tabular-nums leading-tight">
                            PKR {costFormatted}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-teal-500 transition-colors hidden sm:block" />
                      </div>
                    </div>

                    {/* Row 2: Full-width Date & Station side-by-side */}
                    <div className="flex items-center justify-between gap-3 w-full pt-2 border-t border-border/60 text-[11px] sm:text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 shrink-0">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>{dateStr}</span>
                      </span>
                      {expense.stationName && (
                        <span className="inline-flex items-center justify-end gap-1 min-w-0 flex-1 text-right">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{expense.stationName}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile Metrics: Two Merged Sections (No Icons) */}
                  <div className="sm:hidden p-3 space-y-2.5">
                    {/* Merged Section 1: Volume & Odometer */}
                    <div className="grid grid-cols-2 gap-2.5 rounded-lg bg-secondary/40 px-3 py-2 text-left">
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-[10px] text-muted-foreground">Volume</p>
                        <p className="text-xs font-semibold text-foreground tabular-nums truncate">
                          {expense.quantity} L
                        </p>
                        <p className="text-[10px] text-muted-foreground tabular-nums truncate">
                          @ PKR {expense.unitPrice}/L
                        </p>
                      </div>

                      <div className="min-w-0 border-l-2 border-slate-300 dark:border-slate-600/80 pl-3 space-y-0.5">
                        <p className="text-[10px] text-muted-foreground">Odometer</p>
                        <p className="text-xs font-semibold text-foreground tabular-nums truncate">
                          {expense.odometer !== undefined && expense.odometer !== null
                            ? `${expense.odometer.toLocaleString()} km`
                            : "—"}
                        </p>
                        <p className="text-[10px] text-muted-foreground tabular-nums truncate">
                          {expense.distanceTraveled ? `+${expense.distanceTraveled} km trip` : "—"}
                        </p>
                      </div>
                    </div>

                    {/* Merged Section 2: Mileage & Daily Avg */}
                    <div className="grid grid-cols-2 gap-2.5 rounded-lg bg-secondary/40 px-3 py-2 text-left">
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-[10px] text-muted-foreground">Mileage</p>
                        <p
                          className={`text-xs font-bold tabular-nums truncate ${
                            expense.computedEconomy
                              ? "text-teal-600 dark:text-teal-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {expense.computedEconomy ? `${expense.computedEconomy} km/L` : "—"}
                        </p>
                        <p className="text-[10px] text-muted-foreground tabular-nums truncate">
                          {expense.costPerKM ? `PKR ${expense.costPerKM}/km` : "—"}
                        </p>
                      </div>

                      <div className="min-w-0 border-l-2 border-slate-300 dark:border-slate-600/80 pl-3 space-y-0.5">
                        <p className="text-[10px] text-muted-foreground">Daily Avg</p>
                        <p className="text-xs font-semibold text-foreground tabular-nums truncate">
                          {expense.dailyDistanceDriven
                            ? `${Math.round(expense.dailyDistanceDriven)} km/day`
                            : "—"}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {expense.dailyDistanceDriven ? "Driving pace" : "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Metrics Bar: Unified 4-Column Strip with Icons */}
                  <div className="hidden sm:block px-4 py-3">
                    <div className="grid grid-cols-4 gap-3 rounded-lg bg-secondary/40 px-4 py-2.5 text-left">
                      {/* Volume & Unit Price */}
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Droplet className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span>Volume</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground tabular-nums truncate">
                          {expense.quantity} L
                        </p>
                        <p className="text-[11px] text-muted-foreground tabular-nums truncate">
                          @ PKR {expense.unitPrice}/L
                        </p>
                      </div>

                      {/* Odometer & Distance Traveled */}
                      <div className="border-l-2 border-slate-300 dark:border-slate-600/80 pl-3 space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Gauge className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span>Odometer</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground tabular-nums truncate">
                          {expense.odometer !== undefined && expense.odometer !== null
                            ? `${expense.odometer.toLocaleString()} km`
                            : "—"}
                        </p>
                        <p className="text-[11px] text-muted-foreground tabular-nums truncate">
                          {expense.distanceTraveled ? `+${expense.distanceTraveled} km trip` : "—"}
                        </p>
                      </div>

                      {/* Fuel Economy (Mileage in Teal) */}
                      <div className="border-l-2 border-slate-300 dark:border-slate-600/80 pl-3 space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <TrendingUp className="h-3 w-3 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span>Mileage</span>
                        </div>
                        <p
                          className={`text-sm font-bold tabular-nums truncate ${
                            expense.computedEconomy
                              ? "text-teal-600 dark:text-teal-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {expense.computedEconomy ? `${expense.computedEconomy} km/L` : "—"}
                        </p>
                        <p className="text-[11px] text-muted-foreground tabular-nums truncate">
                          {expense.costPerKM ? `PKR ${expense.costPerKM}/km` : "—"}
                        </p>
                      </div>

                      {/* Daily Distance Driven */}
                      <div className="border-l-2 border-slate-300 dark:border-slate-600/80 pl-3 space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Route className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span>Daily Avg</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground tabular-nums truncate">
                          {expense.dailyDistanceDriven
                            ? `${Math.round(expense.dailyDistanceDriven)} km/day`
                            : "—"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {expense.dailyDistanceDriven ? "Driving pace" : "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notes Footer (if present) */}
                  {expense.notes && (
                    <div className="px-3.5 pb-3 sm:px-4 sm:pb-3.5 pt-0.5">
                      <p className="text-xs text-muted-foreground bg-secondary/25 border border-border/60 rounded-lg px-3 py-2 line-clamp-2">
                        {expense.notes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-3">
              <Fuel className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No fuel refills logged</h3>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-sm mx-auto mt-1 mb-5">
              Start logging fuel refills to track mileage and cost per kilometer.
            </p>
            <Button onClick={onLogFuelRefill} size="sm" className="gap-1.5 font-medium">
              <Plus className="h-4 w-4" />
              Log First Fuel Refill
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
