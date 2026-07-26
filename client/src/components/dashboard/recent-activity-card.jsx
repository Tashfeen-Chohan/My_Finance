"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Fuel, Wrench, Calendar } from "lucide-react";

export function RecentActivityCard({ activityList = [] }) {
  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Recent Finance Activity</CardTitle>
              <CardDescription className="text-xs">Latest fuel refills and vehicle maintenance logs</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {activityList.length} Entries
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {activityList.length > 0 ? (
          <div className="divide-y divide-border/40">
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
                  className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                        isFuel
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      }`}
                    >
                      {isFuel ? <Fuel className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-foreground line-clamp-1">{item.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {dateStr}
                        </span>
                        <Badge
                          variant="outline"
                          className={`capitalize text-[10px] py-0 ${
                            isFuel ? "text-amber-500 border-amber-500/30" : "text-purple-400 border-purple-500/30"
                          }`}
                        >
                          {isFuel ? "Fuel Refill" : "Maintenance"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-bold text-sm text-foreground">
                    PKR {Number(item.cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No recent activity recorded yet. Log fuel refills or maintenance to see updates here!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
