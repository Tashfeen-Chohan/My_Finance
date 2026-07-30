"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FuelFilters({
  searchQuery,
  onSearchChange,
  timeRangeFilter,
  onTimeRangeChange,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/40 bg-card/40 p-4 backdrop-blur-xl">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search gas station or notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background/50 border-border/50 rounded-xl"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Time Range Filter */}
        <Select value={timeRangeFilter} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-full sm:w-48 bg-background/50 border-border/50 rounded-xl">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_90_days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
