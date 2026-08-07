"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MonthlyComparisonSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-secondary/20">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
        <Skeleton className="h-4 w-36 rounded-md" />
      </div>

      <div className="grid grid-cols-6 gap-3 items-end h-64 sm:h-72 p-4 rounded-2xl bg-card/30">
        {[45, 75, 35, 90, 60, 80].map((height, i) => (
          <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
            <div className="flex items-end gap-2 w-full justify-center h-full">
              <Skeleton style={{ height: `${height}%` }} className="w-1/2 rounded-t-xl" />
              <Skeleton style={{ height: `${Math.max(15, height - 30)}%` }} className="w-1/2 rounded-t-xl" />
            </div>
            <Skeleton className="h-4 w-10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
