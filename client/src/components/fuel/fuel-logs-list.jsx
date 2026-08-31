"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeSkeleton, FuelLogsListSkeleton } from "@/components/skeletons";
import { Fuel, Plus, Gauge, Calendar, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

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
    <Card className="border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden rounded-2xl shadow-xl">
      <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-secondary/10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-md shadow-amber-500/5">
              <Fuel className="h-5.5 w-5.5" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                Refill Logs History
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Detailed history of fuel refills sorted chronologically
              </CardDescription>
            </div>
          </div>

          {isLoading ? (
            <BadgeSkeleton className="h-8 w-20 rounded-xl" />
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 shadow-sm shrink-0">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-mono font-extrabold text-sm sm:text-base">{expenses.length}</span>
              <span className="hidden sm:inline text-[11px] opacity-80">{expenses.length === 1 ? "Refill Log" : "Total Logs"}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <FuelLogsListSkeleton />
        ) : expenses.length > 0 ? (
          <div className="p-3 sm:p-4 space-y-3">
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
                  className="p-4 sm:p-5 rounded-xl border-2 border-border/80 hover:border-amber-500/40 bg-secondary/15 hover:bg-secondary/30 shadow-sm transition-all cursor-pointer group"
                >
                  {/* MOBILE VIEW (Block < sm) */}
                  <div className="sm:hidden space-y-3">
                    {/* Top Row: Vehicle Icon, Vehicle Name, Station */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
                        <Fuel className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="font-bold text-sm text-foreground truncate">
                          {getVehicleName(expense.vehicleId)}
                        </h4>
                        {expense.stationName ? (
                          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                            <span className="truncate">{expense.stationName}</span>
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground font-medium">Fuel Refill</p>
                        )}
                      </div>
                    </div>

                    {/* Efficiency Badges Bar */}
                    {(expense.isFullTank || expense.computedEconomy || expense.costPerKM || expense.dailyDistanceDriven) && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {expense.isFullTank && (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-semibold gap-0.5 px-2 py-0.5">
                            <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                            Full Tank
                          </Badge>
                        )}
                        {expense.computedEconomy && (
                          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px] font-semibold px-2 py-0.5">
                            {expense.computedEconomy} km/L
                          </Badge>
                        )}
                        {expense.costPerKM && (
                          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px] font-semibold px-2 py-0.5">
                            PKR {expense.costPerKM}/km
                          </Badge>
                        )}
                        {expense.dailyDistanceDriven && (
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] font-semibold px-2 py-0.5">
                            {Math.round(expense.dailyDistanceDriven)} km/day
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Reverted Single Line Pricing Bar */}
                    <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-2.5 border border-border/30 shadow-sm">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-muted-foreground">
                        <span className="font-bold text-foreground">{expense.quantity} L</span>
                        <span className="text-muted-foreground/40">•</span>
                        <span>@ PKR {expense.unitPrice}/L</span>
                      </div>

                      <span className="text-sm font-extrabold text-foreground font-mono">
                        PKR {costFormatted}
                      </span>
                    </div>

                    {/* Metadata Chips: Date & Odometer */}
                    <div className="flex items-center justify-between gap-1.5 text-xs text-muted-foreground pt-0.5">
                      <div className="flex items-center gap-1.5 rounded-lg bg-secondary/40 border border-border/30 px-2 py-1 text-[11px] whitespace-nowrap shrink-0">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-secondary/40 border border-border/30 px-2 py-1 text-[11px] font-mono whitespace-nowrap shrink-0">
                        <Gauge className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                        <span>
                          {expense.odometer?.toLocaleString()} km
                          {expense.distanceTraveled ? ` (+${expense.distanceTraveled} km)` : ""}
                        </span>
                      </div>
                    </div>

                    {expense.notes && (
                      <p className="text-xs text-muted-foreground/80 italic bg-secondary/20 p-2.5 rounded-lg border border-border/20">
                        &quot;{expense.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* DESKTOP VIEW (Hidden < sm) */}
                  <div className="hidden sm:flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <Fuel className="h-5 w-5" />
                      </div>
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-foreground">
                            {getVehicleName(expense.vehicleId)}
                          </h4>
                          {expense.isFullTank && (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[11px] font-medium gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Full Tank
                            </Badge>
                          )}
                          {expense.computedEconomy && (
                            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[11px] font-medium">
                              {expense.computedEconomy} km/L
                            </Badge>
                          )}
                          {expense.costPerKM && (
                            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[11px] font-medium">
                              PKR {expense.costPerKM}/km
                            </Badge>
                          )}
                          {expense.dailyDistanceDriven && (
                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[11px] font-medium">
                              {Math.round(expense.dailyDistanceDriven)} km/day
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5 rounded-lg bg-secondary/40 border border-border/30 px-2.5 py-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                            <span>{dateStr}</span>
                          </div>
                          <div className="flex items-center gap-1.5 rounded-lg bg-secondary/40 border border-border/30 px-2.5 py-1 font-mono">
                            <Gauge className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                            <span>
                              {expense.odometer?.toLocaleString()} km
                              {expense.distanceTraveled ? ` (+${expense.distanceTraveled} km)` : ""}
                            </span>
                          </div>
                          {expense.stationName && (
                            <div className="flex items-center gap-1.5 rounded-lg bg-secondary/40 border border-border/30 px-2.5 py-1 text-foreground/80">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                              <span className="truncate max-w-[200px]">{expense.stationName}</span>
                            </div>
                          )}
                        </div>

                        {expense.notes && (
                          <p className="text-xs text-muted-foreground/80 italic pt-0.5 max-w-2xl line-clamp-2">
                            &quot;{expense.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-foreground">
                        PKR {costFormatted}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {expense.quantity} L @ PKR {expense.unitPrice}/L
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No Fuel Refills Logged</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1 mb-6">
              Start tracking your fuel expenses to unlock monthly mileage trends and cost per kilometer analytics.
            </p>
            <Button onClick={onLogFuelRefill} className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold cursor-pointer">
              <Plus className="h-4 w-4" />
              Log First Fuel Refill
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
