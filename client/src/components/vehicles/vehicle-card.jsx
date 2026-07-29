"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gauge, Star, MoreVertical, Edit2, Trash2, Fuel, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fuelTypeColors = {
  petrol: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  diesel: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  electric: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  hybrid: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  cng: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  other: "bg-slate-500/10 text-slate-400 border-slate-500/20",
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
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 border-border/40 bg-card/60 backdrop-blur-xl">
      {/* Top Banner Image with Gradient Overlay */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <img
          src={photoUrl}
          alt={vehicle.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
          {isDefault && (
            <Badge className="bg-amber-500/90 text-slate-950 font-semibold gap-1 shadow-md border-none backdrop-blur-md">
              <Star className="h-3.5 w-3.5 fill-slate-950" />
              Default Vehicle
            </Badge>
          )}
          <Badge className={`capitalize font-medium border ${fuelTypeColors[vehicle.fuelType] || fuelTypeColors.other}`}>
            <Fuel className="mr-1 h-3 w-3 inline" />
            {vehicle.fuelType}
          </Badge>
        </div>

        {/* Action Dropdown Menu */}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/70 backdrop-blur-md hover:bg-background shadow-md"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 backdrop-blur-xl">
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

      {/* Card Content Body */}
      <CardContent className="p-5 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-1">{vehicle.name}</h3>
            {vehicle.licensePlate && (
              <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider bg-secondary/50">
                {vehicle.licensePlate}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {vehicle.make} {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ""}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="pt-2">
          <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-secondary/30 p-2.5">
            <Gauge className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Odometer Reading</p>
              <p className="text-sm font-semibold text-foreground truncate">
                {vehicle.currentOdometer?.toLocaleString()} {vehicle.mileageUnit || "km"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        {vehicle.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2 pt-1 border-t border-border/40 italic">
            &quot;{vehicle.notes}&quot;
          </p>
        )}
      </CardContent>
    </Card>
  );
}
