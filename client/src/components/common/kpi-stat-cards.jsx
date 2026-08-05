"use client";

import { Card, CardContent } from "@/components/ui/card";
import { KpiCardsSkeleton } from "@/components/skeletons";

export function KpiStatCards({ cards = [], isLoading = false }) {
  if (isLoading) {
    return <KpiCardsSkeleton count={cards.length || 4} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <Card key={card.id || idx} className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm shrink-0 ${card.iconBg}`}>
              {card.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
                {card.label}
              </p>
              <h3 className="text-2xl font-extrabold text-foreground truncate">
                {card.value}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
