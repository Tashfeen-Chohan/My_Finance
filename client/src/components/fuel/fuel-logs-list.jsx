"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Fuel, Plus, MoreVertical, Edit2, Trash2, Gauge, Calendar, MapPin, Sparkles, CheckCircle2, Loader2 } from "lucide-react";

export function FuelLogsList({
  expenses = [],
  vehicles = [],
  isLoading = false,
  onEdit,
  onDelete,
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

          <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 shadow-sm shrink-0">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono font-extrabold text-sm sm:text-base">{expenses.length}</span>
            <span className="hidden sm:inline text-[11px] opacity-80">{expenses.length === 1 ? "Refill Log" : "Total Logs"}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-sm font-medium text-muted-foreground">Loading fuel log data...</p>
          </div>
        ) : expenses.length > 0 ? (
          <div className="divide-y divide-border/40">
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
                  className="p-4 sm:p-5 hover:bg-secondary/30 transition-colors"
                >
                  {/* MOBILE VIEW (Block < sm) */}
                  <div className="sm:hidden space-y-3">
                    {/* Top Row: Icon, Vehicle, Badges & Action Menu */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
                          <Fuel className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-sm text-foreground truncate">
                              {getVehicleName(expense.vehicleId)}
                            </h4>
                            {expense.isFullTank && (
                              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-semibold gap-0.5 px-1.5 py-0">
                                <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                                Full Tank
                              </Badge>
                            )}
                            {expense.computedEconomy && (
                              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[9px] font-semibold px-1.5 py-0">
                                {expense.computedEconomy} km/L
                              </Badge>
                            )}
                          </div>
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

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 backdrop-blur-xl">
                          <DropdownMenuItem onClick={() => onEdit(expense)} className="cursor-pointer">
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Refill Log
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(expense)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Entry
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Single Line Pricing Bar: Copying maintenance page style (bg-secondary/40 border border-border/30) */}
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

                    {/* Metadata: Date & Odometer (+ Distance) */}
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground px-0.5 pt-0.5">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                        <span>{dateStr}</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-mono font-medium">
                        <Gauge className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                        <span>
                          {expense.odometer?.toLocaleString()} km
                          {expense.distanceTraveled ? ` (+${expense.distanceTraveled} km)` : ""}
                        </span>
                      </span>
                    </div>

                    {expense.notes && (
                      <p className="text-xs text-muted-foreground/80 italic bg-secondary/20 p-2 rounded-xl border border-border/20">
                        &quot;{expense.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* DESKTOP VIEW (Hidden < sm) */}
                  <div className="hidden sm:flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <Fuel className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-foreground">{getVehicleName(expense.vehicleId)}</h4>
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
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {dateStr}
                          </span>
                          <span className="flex items-center gap-1">
                            <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
                            {expense.odometer?.toLocaleString()} km
                            {expense.distanceTraveled ? ` (+${expense.distanceTraveled} km)` : ""}
                          </span>
                          {expense.stationName && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                              {expense.stationName}
                            </span>
                          )}
                        </div>
                        {expense.notes && (
                          <p className="text-xs text-muted-foreground/80 italic pt-0.5">
                            &quot;{expense.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          PKR {costFormatted}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {expense.quantity} L @ PKR {expense.unitPrice}/L
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 backdrop-blur-xl">
                          <DropdownMenuItem onClick={() => onEdit(expense)} className="cursor-pointer">
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Refill Log
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(expense)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Entry
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
