"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CardItemSkeleton, KpiCardsSkeleton, MonthlyChartSkeleton } from "./common-skeletons";

export function FuelStatCardsSkeleton({ count = 4 }) {
  return <KpiCardsSkeleton count={count} />;
}

export function FuelReminderCardSkeleton() {
  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden rounded-2xl shadow-xl">
      <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-secondary/10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-2xl shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-48 rounded" />
              <Skeleton className="h-3.5 w-64 rounded" />
            </div>
          </div>
          <Skeleton className="h-8 w-28 rounded-xl shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Progress bar labels skeleton */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-4 w-36 rounded" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>

        {/* Projections metric cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="p-3.5 border border-border/40 bg-card/30 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-5 w-28 rounded" />
            </div>
          </Card>
          <Card className="p-3.5 border border-border/40 bg-card/30 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-5 w-28 rounded" />
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

export function FuelMonthlyChartSkeleton() {
  return <MonthlyChartSkeleton />;
}

export function FuelLogsListSkeleton({ count = 4 }) {
  return (
    <div className="p-3 sm:p-4 space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardItemSkeleton key={i} />
      ))}
    </div>
  );
}
