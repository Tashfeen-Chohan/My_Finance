"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { MonthlyComparisonSkeleton } from "./monthly-comparison-skeleton";

export function MonthlyComparisonCard({ data = [], isLoading = false }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "fuel" | "maintenance"
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 50);
    return () => clearTimeout(timer);
  }, [data, activeFilter]);

  const handleFilterChange = (filter) => {
    setIsAnimated(false);
    setActiveFilter(filter);
  };

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

    const maxSpend = maxVal > 0 ? maxVal * 1.15 : 1000;
    const avgMonthly = data.length > 0 ? totalPeriod / data.length : 0;

    return { maxSpend, totalPeriod, totalFuel, totalMaint, avgMonthly, peakMonth };
  }, [data, activeFilter]);

  const formatCurrency = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toLocaleString();
  };

  return (
    <Card>
      <CardHeader className="p-5 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border">
        <div>
          <CardTitle className="text-base font-semibold">Monthly Spending</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Avg. monthly spend:{" "}
            <span className="font-semibold text-foreground tabular-nums">
              PKR {Math.round(metrics.avgMonthly).toLocaleString()}
            </span>
          </CardDescription>
        </div>

        {!isLoading && (
          <div className="inline-flex items-center rounded-lg bg-secondary p-1 text-xs self-start sm:self-auto">
            {[
              { id: "all", label: "All" },
              { id: "fuel", label: "Fuel" },
              { id: "maintenance", label: "Service" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleFilterChange(tab.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {isLoading ? (
          <MonthlyComparisonSkeleton />
        ) : !data || data.length === 0 ? (
          <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
            <div className="space-y-2">
              <Layers className="h-7 w-7 mx-auto text-muted-foreground/40" />
              <p>No monthly comparison data available for this vehicle.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Legend & Active Readout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-4">
                {(activeFilter === "all" || activeFilter === "fuel") && (
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-xs bg-teal-500" />
                    <span className="text-muted-foreground font-medium">Fuel</span>
                  </div>
                )}
                {(activeFilter === "all" || activeFilter === "maintenance") && (
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-xs bg-sky-500 dark:bg-sky-400" />
                    <span className="text-muted-foreground font-medium">Maintenance</span>
                  </div>
                )}
              </div>

              <div className="min-h-7 flex items-center text-xs tabular-nums">
                {hoveredIndex !== null && data[hoveredIndex] ? (
                  <div className="w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-end gap-x-3 gap-y-1 rounded-lg bg-secondary/60 px-2.5 py-1.5 text-xs">
                    <span className="font-semibold text-foreground">{data[hoveredIndex].label}</span>
                    <div className="flex items-center gap-3">
                      {(activeFilter === "all" || activeFilter === "fuel") && (
                        <span className="text-teal-600 dark:text-teal-400 font-medium">
                          Fuel: PKR {data[hoveredIndex].fuel.toLocaleString()}
                        </span>
                      )}
                      {(activeFilter === "all" || activeFilter === "maintenance") && (
                        <span className="text-sky-600 dark:text-sky-400 font-medium">
                          Service: PKR {data[hoveredIndex].maintenance.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-[11px]">Tap or hover a month to inspect</span>
                )}
              </div>
            </div>

            {/* Clean Chart Area */}
            <div className="relative pt-4 pb-2">
              {/* Y-Axis Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pt-4 pb-8">
                {[1, 0.66, 0.33, 0].map((pct, i) => (
                  <div key={i} className="flex items-center w-full gap-1.5 sm:gap-2">
                    <span className="text-[10px] tabular-nums text-muted-foreground shrink-0 w-8 sm:w-9 text-right">
                      {formatCurrency(metrics.maxSpend * pct)}
                    </span>
                    <div className="w-full border-b border-border/60" />
                  </div>
                ))}
              </div>

              {/* Bars */}
              <div
                className="relative grid gap-1 sm:gap-4 items-end h-52 sm:h-64 pl-9 sm:pl-11 pr-0.5 pb-2"
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
                      onClick={() => setHoveredIndex(isHovered ? null : index)}
                      className={`group relative flex flex-col items-center h-full justify-end rounded-lg transition-colors px-1 pt-2 cursor-pointer ${
                        isHovered ? "bg-secondary/60" : "hover:bg-secondary/30"
                      }`}
                    >
                      <div className="flex items-end justify-center gap-1 sm:gap-1.5 w-full h-full pb-2">
                        {showFuel && (
                          <div className="relative flex-1 flex flex-col items-center h-full justify-end overflow-hidden">
                            <div
                              style={{
                                height: isAnimated ? `${item.fuel > 0 ? Math.max(4, fuelHeightPercent) : 2}%` : "0%",
                                transitionDelay: `${index * 40}ms`,
                              }}
                              className={`w-full rounded-t-sm transition-all duration-500 ease-out ${
                                item.fuel > 0 ? "bg-teal-500" : "bg-border"
                              }`}
                            />
                          </div>
                        )}

                        {showMaint && (
                          <div className="relative flex-1 flex flex-col items-center h-full justify-end overflow-hidden">
                            <div
                              style={{
                                height: isAnimated ? `${item.maintenance > 0 ? Math.max(4, maintHeightPercent) : 2}%` : "0%",
                                transitionDelay: `${index * 40 + 20}ms`,
                              }}
                              className={`w-full rounded-t-sm transition-all duration-500 ease-out ${
                                item.maintenance > 0 ? "bg-sky-500/85 dark:bg-sky-400/85" : "bg-border"
                              }`}
                            />
                          </div>
                        )}
                      </div>

                      <span
                        className={`text-[11px] font-medium truncate transition-colors ${
                          isHovered ? "text-foreground font-semibold" : "text-muted-foreground"
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
