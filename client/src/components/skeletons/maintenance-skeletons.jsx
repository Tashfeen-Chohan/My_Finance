"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CardItemSkeleton, StatValueSkeleton } from "./common-skeletons";

export function MaintenanceStatCardsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardContent className="p-5 flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-20 rounded" />
              <StatValueSkeleton className="w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MaintenanceRemindersSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/40 bg-background/40 p-4 space-y-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-4 w-36 rounded" />
            </div>
            <Skeleton className="h-6 w-20 rounded-lg shrink-0" />
          </div>
          <Skeleton className="h-9 w-full rounded-xl" />
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
