"use client";

import React from "react";
import { Search, SlidersHorizontal, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FuelFilters({
  searchQuery,
  onSearchChange,
  timeRangeFilter,
  onTimeRangeChange,
  sortField = "date",
  onSortFieldChange,
  sortOrder = "desc",
  onSortOrderChange,
}) {
  const isDateSort = sortField === "date";
  const descLabel = isDateSort ? "Newest First" : "High to Low";
  const ascLabel = isDateSort ? "Oldest First" : "Low to High";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-3.5 sm:p-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search gas station or notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background border-border rounded-xl"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5">
        {/* Time Range Filter */}
        <Select value={timeRangeFilter} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-full sm:w-36 bg-background border-border rounded-xl text-xs">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Period" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_90_days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>

        {/* Dynamic Context-Aware Sort Order Dropdown */}
        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger className="w-full sm:w-36 sm:order-3 bg-background border-border rounded-xl text-xs">
            <div className="flex items-center gap-1.5 truncate">
              {sortOrder === "asc" ? (
                <ArrowUp className="h-3.5 w-3.5 text-primary shrink-0" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5 text-primary shrink-0" />
              )}
              <SelectValue placeholder="Order" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">{descLabel}</SelectItem>
            <SelectItem value="asc">{ascLabel}</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Field Options Dropdown */}
        <Select value={sortField} onValueChange={onSortFieldChange}>
          <SelectTrigger className="col-span-2 sm:col-span-1 sm:order-2 w-full sm:w-48 bg-background border-border rounded-xl text-xs">
            <div className="flex items-center gap-1.5 truncate">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Sort By" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="totalCost">Total Cost (PKR)</SelectItem>
            <SelectItem value="unitPrice">Price / Liter (PKR/L)</SelectItem>
            <SelectItem value="quantity">Fuel Volume (Liters)</SelectItem>
            <SelectItem value="distanceTraveled">Distance Traveled (km)</SelectItem>
            <SelectItem value="dailyDistanceDriven">Daily Distance (km/day)</SelectItem>
            <SelectItem value="computedEconomy">Fuel Economy (km/L)</SelectItem>
            <SelectItem value="costPerKM">Cost / Distance (PKR/km)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
