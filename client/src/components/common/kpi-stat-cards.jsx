"use client";

import { Card, CardContent } from "@/components/ui/card";
import { KpiCardsSkeleton } from "@/components/skeletons";

export function KpiStatCards({ cards = [], isLoading = false }) {
  if (isLoading) {
    return <KpiCardsSkeleton count={cards.length || 4} />;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
      {cards.map((card, idx) => (
        <Card
          key={card.id || idx}
          className="bg-card border-border hover:border-primary/30 transition-colors"
        >
          <CardContent className="p-4 sm:p-5 flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-stretch sm:justify-between sm:gap-3">
            {/* Mobile: Left label + sublabel; Desktop: Top label + icon */}
            <div className="flex items-center gap-3 sm:justify-between sm:gap-2 min-w-0">
              <div
                className={`flex h-10 w-10 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl sm:rounded-lg sm:order-2 ${
                  card.iconBg || "bg-secondary text-muted-foreground"
                }`}
              >
                {card.icon}
              </div>
              <div className="min-w-0 sm:order-1">
                <p className="text-xs font-medium text-muted-foreground leading-tight">
                  {card.label}
                </p>
                {card.sublabel && (
                  <p className="text-[11px] text-muted-foreground/80 leading-tight mt-0.5 sm:hidden tabular-nums">
                    {card.sublabel}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right sm:text-left space-y-0.5 shrink-0 sm:shrink sm:min-w-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-foreground tabular-nums leading-snug">
                {card.value}
              </h3>
              {card.sublabel && (
                <p className="hidden sm:block text-[11px] text-muted-foreground leading-tight tabular-nums">
                  {card.sublabel}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
