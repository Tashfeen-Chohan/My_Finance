"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { BadgeSkeleton, MaintenanceLogsListSkeleton } from "@/components/skeletons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wrench, Plus, MoreVertical, Edit2, Trash2, Gauge, Calendar, Droplet, Sparkles, Store, Eye } from "lucide-react";
import { CATEGORY_BADGES, CATEGORY_LABELS } from "@/constants/maintenance";

export function MaintenanceLogsList({
  logs = [],
  vehicles = [],
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onLogMaintenance,
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
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-md shadow-purple-500/5">
              <Wrench className="h-5.5 w-5.5" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                Maintenance History
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Recorded service jobs, oil changes & workshop logs
              </CardDescription>
            </div>
          </div>

          {isLoading ? (
            <BadgeSkeleton className="h-8 w-20 rounded-xl" />
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 shadow-sm shrink-0">
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="font-mono font-extrabold text-sm sm:text-base">{logs.length}</span>
              <span className="hidden sm:inline text-[11px] opacity-80">{logs.length === 1 ? "Log Entry" : "Total Logs"}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <MaintenanceLogsListSkeleton />
        ) : logs.length > 0 ? (
          <div className="p-3 sm:p-4 space-y-3">
            {logs.map((item) => {
              const dateStr = item.date
                ? new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A";

              const isOilChange = item.category === "oil_change";
              const costFormatted = Number(item.cost ?? item.totalCost ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              });

              return (
                <div
                  key={item.id || item._id}
                  onClick={() => onView?.(item)}
                  className="p-4 sm:p-5 rounded-xl border-2 border-border/80 hover:border-primary/50 bg-secondary/15 hover:bg-secondary/30 shadow-sm transition-all cursor-pointer group"
                >
                  {/* MOBILE VIEW (Block < sm) */}
                  <div className="sm:hidden space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm ${CATEGORY_BADGES[item.category] || CATEGORY_BADGES.other}`}>
                          {isOilChange ? <Droplet className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Tooltip content={item.title} side="top">
                            <h4 className="font-bold text-sm text-foreground truncate cursor-pointer group-hover:text-primary transition-colors">{item.title}</h4>
                          </Tooltip>
                          <p className="text-xs text-muted-foreground font-medium truncate">{getVehicleName(item.vehicleId)}</p>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 backdrop-blur-xl">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onView?.(item);
                            }}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4 text-primary" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(item);
                            }}
                            className="cursor-pointer"
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item);
                            }}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Entry
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Cost & Badges Pill Bar (Mobile) */}
                    <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-2.5 border border-border/30">
                      <Badge className={`capitalize text-[10px] font-semibold border ${CATEGORY_BADGES[item.category] || CATEGORY_BADGES.other}`}>
                        {CATEGORY_LABELS[item.category] || item.category}
                      </Badge>

                      <span className="text-sm font-extrabold text-foreground font-mono">
                        PKR {costFormatted}
                      </span>
                    </div>

                    {/* Metadata Chips: Date & Odometer (Space-Between with Light Background) */}
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground pt-0.5">
                      <div className="flex items-center gap-1.5 rounded-lg bg-secondary/40 border border-border/30 px-2.5 py-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                        <span>{dateStr}</span>
                      </div>
                      {item.odometer !== undefined && item.odometer !== null && (
                        <div className="flex items-center gap-1.5 rounded-lg bg-secondary/40 border border-border/30 px-2.5 py-1 font-mono">
                          <Gauge className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                          <span>{item.odometer?.toLocaleString()} km</span>
                        </div>
                      )}
                    </div>

                    {item.serviceProvider && (
                      <div className="flex items-center gap-1.5 rounded-lg bg-secondary/40 border border-border/30 px-2.5 py-1 text-xs text-foreground/80 w-fit max-w-full">
                        <Store className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                        <span className="truncate">{item.serviceProvider}</span>
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-xs text-muted-foreground/80 italic bg-secondary/20 p-2.5 rounded-lg border border-border/20">
                        &quot;{item.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* DESKTOP VIEW (Hidden < sm) */}
                  <div className="hidden sm:flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${CATEGORY_BADGES[item.category] || CATEGORY_BADGES.other}`}>
                        {isOilChange ? <Droplet className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                      </div>
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                          <Badge className={`capitalize text-[11px] font-medium border ${CATEGORY_BADGES[item.category] || CATEGORY_BADGES.other}`}>
                            {CATEGORY_LABELS[item.category] || item.category}
                          </Badge>
                          <Badge variant="outline" className="text-[11px] font-mono">
                            {getVehicleName(item.vehicleId)}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5 rounded-lg bg-secondary/40 border border-border/30 px-2.5 py-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                            <span>{dateStr}</span>
                          </div>
                          {item.odometer !== undefined && item.odometer !== null && (
                            <div className="flex items-center gap-1.5 rounded-lg bg-secondary/40 border border-border/30 px-2.5 py-1 font-mono">
                              <Gauge className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                              <span>{item.odometer?.toLocaleString()} km</span>
                            </div>
                          )}
                          {item.serviceProvider && (
                            <div className="flex items-center gap-1.5 rounded-lg bg-secondary/40 border border-border/30 px-2.5 py-1 text-foreground/80">
                              <Store className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                              <span className="truncate max-w-[200px]">{item.serviceProvider}</span>
                            </div>
                          )}
                        </div>

                        {item.notes && (
                          <p className="text-xs text-muted-foreground/80 italic pt-0.5 max-w-2xl line-clamp-2">
                            &quot;{item.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          PKR {costFormatted}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary/60">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 backdrop-blur-xl">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onView?.(item);
                            }}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4 text-primary" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(item);
                            }}
                            className="cursor-pointer"
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item);
                            }}
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
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-4">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No Maintenance Records Logged</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1 mb-6">
              Start logging your oil changes, repairs, and service history to track vehicle health and expenses.
            </p>
            <Button onClick={onLogMaintenance} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer">
              <Plus className="h-4 w-4" />
              Log First Maintenance
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
