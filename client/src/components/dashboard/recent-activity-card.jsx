"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BadgeSkeleton, CardItemSkeleton } from "@/components/skeletons";
import { Fuel, Wrench } from "lucide-react";

export function RecentActivityCard({ activityList = [], isLoading = false }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-5 pb-3.5 border-b border-border flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          <CardDescription className="text-xs mt-0.5">Latest fuel refills and service logs</CardDescription>
        </div>
        {isLoading ? (
          <BadgeSkeleton className="w-16" />
        ) : (
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {activityList.length} entries
          </span>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <CardItemSkeleton />
            <CardItemSkeleton />
            <CardItemSkeleton />
          </div>
        ) : activityList.length > 0 ? (
          <div className="divide-y divide-border">
            {activityList.map((item, index) => {
              const isFuel = item.type === "fuel";
              const dateStr = item.date
                ? new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "N/A";

              return (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between px-5 py-3.5 gap-3 hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isFuel
                          ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                          : "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                      }`}
                    >
                      {isFuel ? <Fuel className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm text-foreground truncate">{item.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {isFuel ? "Fuel Refill" : "Maintenance"} · {dateStr}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-semibold text-sm text-foreground tabular-nums">
                    PKR {Number(item.cost).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground text-xs sm:text-sm">
            No recent activity recorded yet. Log fuel refills or maintenance to see updates here.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
