"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Fuel, Wrench, Car } from "lucide-react";

export function QuickActionsBar() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-2.5">
      <Link href="/fuel" className="w-full sm:w-auto">
        <Button size="sm" variant="outline" className="w-full sm:w-auto gap-1.5 font-medium bg-card">
          <Fuel className="h-3.5 w-3.5 shrink-0 text-teal-600 dark:text-teal-400" />
          <span className="truncate">Log Fuel</span>
        </Button>
      </Link>

      <Link href="/maintenance" className="w-full sm:w-auto">
        <Button size="sm" variant="outline" className="w-full sm:w-auto gap-1.5 font-medium bg-card">
          <Wrench className="h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
          <span className="truncate">Service</span>
        </Button>
      </Link>

      <Link href="/vehicles" className="w-full sm:w-auto">
        <Button size="sm" variant="outline" className="w-full sm:w-auto gap-1.5 font-medium bg-card">
          <Car className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">Vehicle</span>
        </Button>
      </Link>
    </div>
  );
}
