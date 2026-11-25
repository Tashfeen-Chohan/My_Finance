"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeSkeleton, MaintenanceLogsListSkeleton } from "@/components/skeletons";
import {
  Wrench,
  Plus,
  Droplet,
  Receipt,
  Calendar,
  Gauge,
  Store,
  Tag,
  ChevronRight,
} from "lucide-react";
import { CATEGORY_LABELS } from "@/constants/maintenance";

export function MaintenanceLogsList({
  logs = [],
  isLoading = false,
  onView,
  onLogMaintenance,
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 sm:p-5 border-b border-border flex flex-row items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Maintenance History</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Recorded service jobs, oil changes, and repairs
          </CardDescription>
        </div>

        {isLoading ? (
          <BadgeSkeleton className="h-6 w-16" />
        ) : (
          <Badge variant="secondary" className="text-xs font-medium tabular-nums shrink-0">
            {logs.length} {logs.length === 1 ? "entry" : "entries"}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-3 sm:p-6 bg-secondary/15 dark:bg-black/25">
        {isLoading ? (
          <MaintenanceLogsListSkeleton />
        ) : logs.length > 0 ? (
          <div className="space-y-4 md:space-y-7">
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

              const categoryLabel = CATEGORY_LABELS[item.category] || item.category;

              return (
                <div
                  key={item.id || item._id}
                  onClick={() => onView?.(item)}
                  className="group rounded-xl border-2 border-slate-200 dark:border-slate-700/90 bg-card hover:border-sky-500/50 active:bg-secondary/30 shadow-sm transition-all cursor-pointer overflow-hidden md:pb-2"
                >
                  {/* Mobile View */}
                  <div className="sm:hidden p-3.5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                          {isOilChange ? <Droplet className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm text-foreground truncate">{item.title}</h4>
                          <p className="text-[11px] text-sky-600 dark:text-sky-400 font-medium truncate">
                            {categoryLabel}
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-bold text-foreground tabular-nums shrink-0">
                        PKR {costFormatted}
                      </span>
                    </div>

                    {/* Structured Labeled Data Strip with Strong Separator */}
                    <div className="grid grid-cols-2 gap-2.5 rounded-lg bg-secondary/40 px-3 py-2 text-left">
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground">Date</p>
                        <p className="text-xs font-semibold text-foreground truncate">{dateStr}</p>
                      </div>
                      <div className="min-w-0 border-l-2 border-slate-300 dark:border-slate-600/80 pl-3">
                        <p className="text-[10px] text-muted-foreground">Odometer</p>
                        <p className="text-xs font-semibold text-foreground tabular-nums truncate">
                          {item.odometer !== undefined && item.odometer !== null
                            ? `${item.odometer.toLocaleString()} km`
                            : "—"}
                        </p>
                      </div>
                    </div>

                    {(item.serviceProvider || item.receiptUrl) && (
                      <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                        {item.serviceProvider ? (
                          <span className="inline-flex items-center gap-1 truncate">
                            <Store className="h-3 w-3 shrink-0" />
                            <span className="truncate">{item.serviceProvider}</span>
                          </span>
                        ) : (
                          <span />
                        )}
                        {item.receiptUrl && (
                          <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium shrink-0">
                            <Receipt className="h-3 w-3" />
                            Receipt
                          </span>
                        )}
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Laptop / Desktop View (Structured Card like Fuel) */}
                  <div className="hidden sm:block">
                    {/* Card Top Bar */}
                    <div className="px-4 py-3.5 bg-secondary/30 border-b border-border space-y-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                            {isOilChange ? <Droplet className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <h4 className="font-semibold text-base text-foreground truncate">
                              {item.title}
                            </h4>
                            {item.receiptUrl && (
                              <Badge
                                variant="secondary"
                                className="text-[11px] font-medium gap-1 text-foreground px-2 py-0 shrink-0"
                              >
                                <Receipt className="h-3 w-3 text-sky-600 dark:text-sky-400" />
                                Receipt
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium leading-none mb-0.5">
                              Total
                            </p>
                            <p className="text-base font-bold text-foreground tabular-nums leading-tight">
                              PKR {costFormatted}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-sky-500 transition-colors" />
                        </div>
                      </div>

                      {/* Full-width Date & Workshop Sub-row */}
                      <div className="flex items-center justify-between gap-3 w-full pt-2 border-t border-border/60 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 shrink-0">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{dateStr}</span>
                        </span>
                        {item.serviceProvider && (
                          <span className="inline-flex items-center justify-end gap-1.5 min-w-0 flex-1 text-right">
                            <Store className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{item.serviceProvider}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Unified 3-Column Metrics Strip with Icons */}
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-3 gap-3 rounded-lg bg-secondary/40 px-4 py-2.5 text-left">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Tag className="h-3 w-3 text-sky-600 dark:text-sky-400 shrink-0" />
                            <span>Category</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground truncate">
                            {categoryLabel}
                          </p>
                        </div>

                        <div className="border-l-2 border-slate-300 dark:border-slate-600/80 pl-3 space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Gauge className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span>Odometer</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground tabular-nums truncate">
                            {item.odometer !== undefined && item.odometer !== null
                              ? `${item.odometer.toLocaleString()} km`
                              : "—"}
                          </p>
                        </div>

                        <div className="border-l-2 border-slate-300 dark:border-slate-600/80 pl-3 space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Store className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span>Workshop</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground truncate">
                            {item.serviceProvider || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {item.notes && (
                      <div className="px-4 pb-3.5 pt-0.5">
                        <p className="text-xs text-muted-foreground bg-secondary/25 border border-border/60 rounded-lg px-3 py-2 line-clamp-2">
                          {item.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-3">
              <Wrench className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No maintenance records</h3>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-sm mx-auto mt-1 mb-5">
              Log oil changes, repairs, and services to keep track of your vehicle health.
            </p>
            <Button onClick={onLogMaintenance} size="sm" className="gap-1.5 font-medium">
              <Plus className="h-4 w-4" />
              Log First Maintenance
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
