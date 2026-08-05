"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { BadgeSkeleton, CardItemSkeleton } from "@/components/skeletons";
import { Activity, Fuel, Wrench, Calendar } from "lucide-react";

export function RecentActivityCard({ activityList = [], isLoading = false }) {
  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-2xl shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 pt-5 px-4 sm:px-6 border-b border-border/30 bg-secondary/10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Activity className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground truncate">
                Recent Finance Activity
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground truncate">
                Latest fuel refills & maintenance logs
              </CardDescription>
            </div>
          </div>
          {isLoading ? (
            <BadgeSkeleton className="w-16" />
          ) : (
            <Badge
              variant="outline"
              className="font-mono text-xs border-primary/30 text-primary bg-primary/10 px-2.5 py-0.5 rounded-full shrink-0"
            >
              {activityList.length} Entries
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <CardItemSkeleton />
            <CardItemSkeleton />
            <CardItemSkeleton />
          </div>
        ) : activityList.length > 0 ? (
          <div className="divide-y divide-border/30">
            {activityList.map((item, index) => {
              const isFuel = item.type === "fuel";
              const dateStr = item.date
                ? new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A";

              return (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between p-4 gap-3 hover:bg-secondary/40 active:bg-secondary/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm ${
                        isFuel
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      }`}
                    >
                      {isFuel ? <Fuel className="h-4.5 w-4.5" /> : <Wrench className="h-4.5 w-4.5" />}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <Tooltip content={item.title} side="top">
                        <h4 className="font-bold text-xs sm:text-sm text-foreground truncate cursor-pointer">
                          {item.title}
                        </h4>
                      </Tooltip>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium text-muted-foreground/90 shrink-0">
                          <Calendar className="h-3 w-3 text-primary/70" />
                          {dateStr}
                        </span>
                        <Badge
                          variant="outline"
                          className={`capitalize text-[10px] px-1.5 py-0 rounded-md font-semibold ${
                            isFuel
                              ? "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10"
                              : "text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10"
                          }`}
                        >
                          {isFuel ? "Fuel Refill" : "Maintenance"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono font-extrabold text-xs sm:text-sm text-foreground bg-secondary/40 px-2.5 py-1 rounded-xl border border-border/40">
                    PKR {Number(item.cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground text-xs sm:text-sm">
            No recent activity recorded yet. Log fuel refills or maintenance to see updates here!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
