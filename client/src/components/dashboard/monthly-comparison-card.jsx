"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3, Fuel, Wrench, Calendar, TrendingUp, Sparkles, Layers } from "lucide-react";
import { MonthlyComparisonSkeleton } from "./monthly-comparison-skeleton";

export function MonthlyComparisonCard({ data = [], isLoading = false }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "fuel" | "maintenance"
  const [isAnimated, setIsAnimated] = useState(false);

  // Trigger smooth height growth animation on mount or data change
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 50);
    return () => clearTimeout(timer);
  }, [data, activeFilter]);

  const handleFilterChange = (filter) => {
    setIsAnimated(false);
    setActiveFilter(filter);
  };

  // Compute metrics: Max spend, totals, average, peak month
  const metrics = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxSpend: 1000, totalPeriod: 0, totalFuel: 0, totalMaint: 0, avgMonthly: 0, peakMonth: null };
    }

    let maxVal = 0;
    let totalPeriod = 0;
    let totalFuel = 0;
    let totalMaint = 0;
    let peakMonth = data[0];

    data.forEach((item) => {
      const fuelVal = item.fuel || 0;
      const maintVal = item.maintenance || 0;
      const totalVal = item.total || 0;

      totalFuel += fuelVal;
      totalMaint += maintVal;
      totalPeriod += totalVal;

      if (activeFilter === "fuel") {
        maxVal = Math.max(maxVal, fuelVal);
      } else if (activeFilter === "maintenance") {
        maxVal = Math.max(maxVal, maintVal);
      } else {
        maxVal = Math.max(maxVal, fuelVal, maintVal, totalVal);
      }

      if (totalVal > (peakMonth?.total || 0)) {
        peakMonth = item;
      }
    });

    const maxSpend = maxVal > 0 ? maxVal * 1.15 : 1000; // 15% headroom
    const avgMonthly = data.length > 0 ? totalPeriod / data.length : 0;

    return { maxSpend, totalPeriod, totalFuel, totalMaint, avgMonthly, peakMonth };
  }, [data, activeFilter]);

  const formatCurrency = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toLocaleString();
  };

  return (
    <Card className="border-border/40 bg-gradient-to-b from-card/60 via-card/40 to-card/20 backdrop-blur-xl overflow-hidden shadow-xl transition-all duration-300">
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border/20">
        {/* Title section */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-emerald-500/5 text-emerald-400 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg font-extrabold tracking-tight">
                Monthly Expense Comparison
              </CardTitle>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                <Sparkles className="h-2.5 w-2.5" /> Enhanced
              </span>
            </div>
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>Fuel refills vs. Maintenance services comparative breakdown</span>
            </CardDescription>
          </div>
        </div>

        {/* Filter Controls & Period Selector */}
        {!isLoading && (
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {/* Category Filter Pills */}
            <div className="flex items-center rounded-xl bg-secondary/40 p-1 border border-border/40 text-xs">
              <button
                type="button"
                onClick={() => handleFilterChange("all")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeFilter === "all"
                    ? "bg-background text-foreground shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange("fuel")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                  activeFilter === "fuel"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold"
                    : "text-muted-foreground hover:text-amber-400"
                }`}
              >
                <Fuel className="h-3 w-3" /> Fuel
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange("maintenance")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                  activeFilter === "maintenance"
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold"
                    : "text-muted-foreground hover:text-purple-400"
                }`}
              >
                <Wrench className="h-3 w-3" /> Maintenance
              </button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {isLoading ? (
          <MonthlyComparisonSkeleton />
        ) : !data || data.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border/40 text-center text-xs text-muted-foreground">
            <div className="space-y-2">
              <Layers className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p>No monthly comparison data available for this vehicle.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Monthly Average Banner */}
            <div className="flex items-center justify-between rounded-2xl bg-secondary/20 border border-border/30 px-4 py-2.5 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-muted-foreground font-semibold">Monthly Average:</span>
              </div>
              <span className="text-sm sm:text-base font-extrabold font-mono text-emerald-400">
                PKR {Math.round(metrics.avgMonthly).toLocaleString()}
              </span>
            </div>

            {/* Chart Legend & Live Tooltip Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
              <div className="flex items-center gap-5">
                {(activeFilter === "all" || activeFilter === "fuel") && (
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-md bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                    <span className="font-semibold text-foreground">Fuel Spend</span>
                  </div>
                )}
                {(activeFilter === "all" || activeFilter === "maintenance") && (
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-md bg-gradient-to-tr from-purple-600 via-purple-500 to-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                    <span className="font-semibold text-foreground">Maintenance Spend</span>
                  </div>
                )}
              </div>

              {/* Dynamic Hover Details Banner */}
              <div className="h-7 flex items-center justify-end font-mono text-xs overflow-hidden">
                {hoveredIndex !== null && data[hoveredIndex] ? (
                  <div className="flex items-center gap-3 h-full animate-in fade-in-50 duration-150 bg-background/80 px-3 rounded-lg border border-border/60 shadow-sm">
                    <span className="font-bold text-foreground">{data[hoveredIndex].label}:</span>
                    {(activeFilter === "all" || activeFilter === "fuel") && (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Fuel className="h-3 w-3" /> PKR {data[hoveredIndex].fuel.toLocaleString()}
                      </span>
                    )}
                    {(activeFilter === "all" || activeFilter === "maintenance") && (
                      <span className="text-purple-400 font-bold flex items-center gap-1">
                        <Wrench className="h-3 w-3" /> PKR {data[hoveredIndex].maintenance.toLocaleString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center h-full px-2">
                    <span className="text-muted-foreground/50 italic text-[11px]">Hover over bars to inspect amounts</span>
                  </div>
                )}
              </div>
            </div>

            {/* Prominent Bolder Chart Area */}
            <div className="relative pt-10 pb-3 px-2 rounded-2xl bg-card/30 border border-border/30">
              {/* Background Horizontal Y-Axis Grid Lines & Markers */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pt-10 pb-10 px-3">
                {[1, 0.66, 0.33, 0].map((pct, i) => (
                  <div key={i} className="flex items-center w-full gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground/50 shrink-0 w-8 text-right">
                      {formatCurrency(metrics.maxSpend * pct)}
                    </span>
                    <div className="w-full border-b border-border/20 border-dashed" />
                  </div>
                ))}
              </div>

              {/* Bars Grid Container */}
              <div
                className="relative grid gap-2 sm:gap-4 items-end h-64 sm:h-72 lg:h-80 pl-10 pr-2 pb-2"
                style={{
                  gridTemplateColumns: `repeat(${data.length || 1}, minmax(0, 1fr))`,
                }}
              >
                {data.map((item, index) => {
                  const fuelHeightPercent = Math.max(0, (item.fuel / metrics.maxSpend) * 100);
                  const maintHeightPercent = Math.max(0, (item.maintenance / metrics.maxSpend) * 100);
                  const isHovered = hoveredIndex === index;

                  const showFuel = activeFilter === "all" || activeFilter === "fuel";
                  const showMaint = activeFilter === "all" || activeFilter === "maintenance";

                  return (
                    <div
                      key={item.label || index}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`group relative flex flex-col items-center h-full justify-end rounded-2xl transition-all duration-200 ease-out p-1.5 cursor-pointer transform-gpu origin-bottom ${
                        isHovered ? "bg-secondary/35 scale-[1.03] z-10 shadow-lg" : "hover:bg-secondary/15 z-0"
                      }`}
                    >
                      {/* Floating Total Value Badge on Hover */}
                      <div
                        className={`absolute -top-10 z-20 px-2.5 py-1 rounded-xl bg-popover text-popover-foreground border border-border/80 text-[11px] font-mono font-bold shadow-xl transition-all duration-200 flex items-center gap-1 ${
                          isHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1 scale-95 pointer-events-none"
                        }`}
                      >
                        <TrendingUp className="h-3 w-3 text-emerald-400" />
                        <span>PKR {item.total.toLocaleString()}</span>
                      </div>

                      {/* Prominent Bolder Grouped Bars Track */}
                      <div className="flex items-end justify-center gap-1.5 sm:gap-2 w-full h-full pb-2">
                        {/* Fuel Bar */}
                        {showFuel && (
                          <div className="relative flex-1 flex flex-col items-center h-full justify-end bg-amber-500/5 rounded-t-xl border-x border-t border-amber-500/10 overflow-hidden">
                            <div
                              style={{
                                height: isAnimated ? `${item.fuel > 0 ? Math.max(8, fuelHeightPercent) : 2}%` : "0%",
                                transitionDelay: `${index * 60}ms`,
                              }}
                              className={`w-full rounded-t-xl transition-all duration-700 ease-out ${
                                item.fuel > 0
                                  ? "bg-gradient-to-t from-amber-700 via-amber-500 to-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.35)] group-hover:brightness-125"
                                  : "bg-amber-500/20"
                              }`}
                            />
                          </div>
                        )}

                        {/* Maintenance Bar */}
                        {showMaint && (
                          <div className="relative flex-1 flex flex-col items-center h-full justify-end bg-purple-500/5 rounded-t-xl border-x border-t border-purple-500/10 overflow-hidden">
                            <div
                              style={{
                                height: isAnimated ? `${item.maintenance > 0 ? Math.max(8, maintHeightPercent) : 2}%` : "0%",
                                transitionDelay: `${index * 60 + 30}ms`,
                              }}
                              className={`w-full rounded-t-xl transition-all duration-700 ease-out ${
                                item.maintenance > 0
                                  ? "bg-gradient-to-t from-purple-700 via-purple-500 to-purple-300 shadow-[0_0_16px_rgba(168,85,247,0.35)] group-hover:brightness-125"
                                  : "bg-purple-500/20"
                              }`}
                            />
                          </div>
                        )}
                      </div>

                      {/* Month Label */}
                      <span
                        className={`text-[11px] sm:text-xs font-bold tracking-tight truncate transition-colors duration-200 ${
                          isHovered ? "text-emerald-400 font-bold" : "text-muted-foreground"
                        }`}
                      >
                        {item.monthName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
