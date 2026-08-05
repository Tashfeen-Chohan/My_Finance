"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatValueSkeleton({ className }) {
  return <Skeleton className={cn("h-7 w-20 rounded-md mt-1", className)} />;
}

export function BadgeSkeleton({ className }) {
  return <Skeleton className={cn("h-5 w-16 rounded-full", className)} />;
}

export function KpiCardSkeleton({ className }) {
  return (
    <Card className={cn("border-border/50 bg-card/50 backdrop-blur-xl", className)}>
      <CardContent className="p-5 flex items-center gap-4">
        <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
        <div className="space-y-2 flex-1 min-w-0">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-7 w-32 rounded-md" />
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
    <div className={cn("p-4 sm:p-5 rounded-xl border border-border/30 bg-secondary/10 space-y-3", className)}>
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
