"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CardItemSkeleton, StatValueSkeleton } from "./common-skeletons";

export function FuelStatCardsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardContent className="p-5 flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-24 rounded" />
              <StatValueSkeleton className="w-28" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
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
  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-44 rounded" />
          </div>
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Skeleton className="h-3.5 w-60 rounded mt-1" />
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex h-56 items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-border/40">
          {[40, 65, 30, 85, 50, 75].map((heightPct, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
              <Skeleton
                style={{ height: `${heightPct}%` }}
                className="w-full rounded-t-lg opacity-60 animate-pulse"
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

export function FuelLogsListSkeleton({ count = 4 }) {
  return (
    <div className="p-3 sm:p-4 space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardItemSkeleton key={i} />
      ))}
    </div>
  );
}
