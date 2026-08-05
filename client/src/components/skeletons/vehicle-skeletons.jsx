"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function VehicleCardSkeleton({ className }) {
  return (
    <Card className={cn("group relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-xl", className)}>
      <div className="relative h-44 w-full overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="absolute top-3 right-3">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-6 w-36 rounded" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-28 rounded" />
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-secondary/30 p-2.5">
            <Skeleton className="h-4 w-4 rounded shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function VehicleGridSkeleton({ count = 3, className }) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}
