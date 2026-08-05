"use client";

import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";
import { VehicleGridSkeleton } from "@/components/skeletons";

export function VehicleGrid({
  vehicles = [],
  isLoading = false,
  hasFilters = false,
  onEdit,
  onDelete,
  onSetDefault,
  onAddVehicle,
}) {
  if (isLoading) {
    return <VehicleGridSkeleton />;
  }

  if (vehicles.length > 0) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id || vehicle._id}
            vehicle={vehicle}
            onEdit={onEdit}
            onDelete={onDelete}
            onSetDefault={onSetDefault}
          />
        ))}
      </div>
    );
  }

  return (
    <Card className="border-dashed border-border/60 bg-card/20 p-12 text-center backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
        <Sparkles className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-foreground">No Vehicles Found</h3>
      <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1 mb-6">
        {hasFilters
          ? "No vehicles matched your filter criteria. Try clearing search filters."
          : "Your garage is currently empty. Register your first vehicle to start tracking fuel logs and maintenance history."}
      </p>
      <Button onClick={onAddVehicle} className="gap-2 cursor-pointer">
        <Plus className="h-4 w-4" />
        Add First Vehicle
      </Button>
    </Card>
  );
}
