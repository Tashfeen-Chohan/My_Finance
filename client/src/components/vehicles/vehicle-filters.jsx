"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Fuel } from "lucide-react";

export function VehicleFilters({
  searchQuery,
  onSearchChange,
  fuelFilter,
  onFuelFilterChange,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-3.5 sm:p-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search make, model, license plate..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background border-border rounded-xl"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
          <Fuel className="h-3.5 w-3.5" />
          <span>Fuel</span>
        </div>
        <Select value={fuelFilter} onValueChange={onFuelFilterChange}>
          <SelectTrigger className="w-full sm:w-40 bg-background border-border rounded-xl">
            <SelectValue placeholder="Fuel Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fuel Types</SelectItem>
            <SelectItem value="petrol">Petrol</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
            <SelectItem value="electric">Electric (EV)</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="cng">CNG</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
