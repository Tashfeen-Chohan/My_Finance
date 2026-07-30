"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatValueSkeleton({ className }) {
  return <Skeleton className={cn("h-7 w-20 rounded-md mt-1", className)} />;
}

export function BadgeSkeleton({ className }) {
  return <Skeleton className={cn("h-5 w-16 rounded-full", className)} />;
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
