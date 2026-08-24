"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CardItemSkeleton, KpiCardsSkeleton, MonthlyChartSkeleton } from "./common-skeletons";

export function MaintenanceStatCardsSkeleton({ count = 4 }) {
  return <KpiCardsSkeleton count={count} />;
}

export function MaintenanceMonthlyChartSkeleton() {
  return <MonthlyChartSkeleton />;
}

export function MaintenanceRemindersSkeleton({ count = 2 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/30 bg-secondary/10 p-4 sm:p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-5 w-40 rounded" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded-lg shrink-0" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function MaintenanceLogsListSkeleton({ count = 4 }) {
  return (
    <div className="p-3 sm:p-4 space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardItemSkeleton key={i} />
      ))}
    </div>
  );
}
