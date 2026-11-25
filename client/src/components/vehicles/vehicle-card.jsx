"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gauge, Star, MoreVertical, Edit2, Trash2, Fuel } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fuelTypeColors = {
  petrol: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  diesel: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  electric: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  hybrid: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  cng: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  other: "bg-secondary text-muted-foreground border-border",
};

const defaultVehicleImages = {
  sedan: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80",
  suv: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
  electric: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
  hatchback: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
};

export function VehicleCard({ vehicle, onEdit, onDelete, onSetDefault }) {
  const vehicleId = vehicle.id || vehicle._id;
  const isDefault = Boolean(vehicle.isDefault);
  const photoUrl = vehicle.photoUrl || defaultVehicleImages.sedan;

  return (
    <Card className="group overflow-hidden transition-colors hover:border-foreground/20">
      <div className="relative h-40 w-full overflow-hidden bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt={vehicle.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          {isDefault && (
            <Badge className="bg-background/90 text-foreground font-medium gap-1 border border-border">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              Default
            </Badge>
          )}
          <Badge className={`capitalize font-medium border bg-background/90 ${fuelTypeColors[vehicle.fuelType] || fuelTypeColors.other}`}>
            <Fuel className="mr-1 h-3 w-3 inline" />
            {vehicle.fuelType}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/85 hover:bg-background"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {!isDefault && (
                <>
                  <DropdownMenuItem onClick={() => onSetDefault(vehicleId)} className="cursor-pointer">
                    <Star className="mr-2 h-4 w-4 text-amber-500" />
                    Set as Default
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => onEdit(vehicle)} className="cursor-pointer">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(vehicle)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Vehicle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold tracking-tight text-foreground truncate">{vehicle.name}</h3>
            {vehicle.licensePlate && (
              <Badge variant="outline" className="font-mono text-[11px] uppercase tracking-wider shrink-0">
                {vehicle.licensePlate}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {vehicle.make} {vehicle.model} {vehicle.year ? `· ${vehicle.year}` : ""}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Gauge className="h-4 w-4 text-primary shrink-0" />
            <span>Odometer</span>
          </div>
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {vehicle.currentOdometer?.toLocaleString()} {vehicle.mileageUnit || "km"}
          </span>
        </div>

        {vehicle.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2 pt-2 border-t border-border">
            {vehicle.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
