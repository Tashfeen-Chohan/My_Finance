"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Fuel, Wrench, Car } from "lucide-react";

export function QuickActionsBar() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-4 backdrop-blur-xl">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">
        Quick Actions:
      </span>
      <Link href="/fuel">
        <Button size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-md shadow-amber-500/10 cursor-pointer">
          <Fuel className="h-4 w-4" />
          Log Fuel Refill
        </Button>
      </Link>

      <Link href="/maintenance">
        <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md shadow-purple-500/10 cursor-pointer">
          <Wrench className="h-4 w-4" />
          Log Maintenance
        </Button>
      </Link>

      <Link href="/vehicles">
        <Button size="sm" variant="outline" className="gap-2 cursor-pointer border-border/60">
          <Car className="h-4 w-4 text-primary" />
          Add Vehicle
        </Button>
      </Link>
    </div>
  );
}
