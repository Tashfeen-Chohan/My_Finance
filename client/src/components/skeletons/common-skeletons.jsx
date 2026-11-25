"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatValueSkeleton({ className }) {
  return <Skeleton className={cn("h-7 w-20 rounded-md mt-1", className)} />;
}

export function BadgeSkeleton({ className }) {
  return <Skeleton className={cn("h-5 w-16 rounded-full", className)} />;
}

export function KpiCardSkeleton({ className }) {
  return (
    <Card className={cn("bg-card border-border", className)}>
      <CardContent className="p-4 sm:p-5 flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-stretch sm:gap-3">
        <div className="flex items-center gap-3 sm:justify-between sm:gap-2 min-w-0">
          <Skeleton className="h-10 w-10 sm:h-8 sm:w-8 shrink-0 rounded-xl sm:rounded-lg sm:order-2" />
          <Skeleton className="h-3.5 w-24 rounded sm:order-1" />
        </div>
        <div className="space-y-1.5 text-right sm:text-left">
          <Skeleton className="h-6 sm:h-7 w-28 rounded-md ml-auto sm:ml-0" />
          <Skeleton className="hidden sm:block h-3 w-20 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiCardsSkeleton({ count = 4, className }) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <KpiCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CardItemSkeleton({ className }) {
  return (
    <div className={cn("p-4 sm:p-5 rounded-xl border-2 border-slate-200 dark:border-slate-700/90 bg-card space-y-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
          <div className="space-y-2 flex-1 max-w-sm">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
        <Skeleton className="h-7 w-24 rounded-lg shrink-0" />
      </div>
      <div className="flex items-center justify-between gap-2 pt-1">
        <Skeleton className="h-6 w-24 rounded-lg" />
        <Skeleton className="h-6 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function MonthlyChartSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-48 rounded" />
            </div>
          </div>
          <Skeleton className="h-7 w-32 rounded-xl shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="flex h-56 items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-border/40">
          {[40, 65, 30, 85, 50, 75].map((heightPct, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
              <Skeleton
                style={{ height: `${heightPct}%` }}
                className="w-full rounded-t-lg"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-3 sm:gap-6 pt-3 px-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center space-y-1">
              <Skeleton className="h-3 w-10 rounded" />
              <Skeleton className="h-3.5 w-14 rounded" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

