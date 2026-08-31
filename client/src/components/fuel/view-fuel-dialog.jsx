"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Fuel,
  Calendar,
  Gauge,
  MapPin,
  FileText,
  Edit2,
  Trash2,
  Coins,
  CheckCircle2,
  TrendingUp,
  Droplet,
} from "lucide-react";

export function ViewFuelDialog({
  open,
  onOpenChange,
  expense = null,
  vehicles = [],
  onEdit,
  onDelete,
}) {
  if (!expense) return null;

  const vehicleId = expense.vehicleId?._id || expense.vehicleId;
  const vehicle = vehicles.find((v) => (v.id || v._id) === vehicleId);
  const vehicleName = vehicle
    ? vehicle.name
    : typeof expense.vehicleId === "object"
    ? expense.vehicleId?.name
    : "Vehicle";

  const rawCost = Number(expense.totalCost ?? 0);
  const costFormatted =
    rawCost % 1 === 0
      ? rawCost.toLocaleString()
      : rawCost.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const dateStr = expense.date
    ? new Date(expense.date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const handleEditClick = () => {
    onOpenChange(false);
    if (onEdit) onEdit(expense);
  };

  const handleDeleteClick = () => {
    onOpenChange(false);
    if (onDelete) onDelete(expense);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[92vw] sm:w-full max-h-[90vh] overflow-y-auto p-3.5 sm:p-6 rounded-2xl">
        {/* Header Section */}
        <DialogHeader className="space-y-2 pb-3 border-b-2 border-slate-300 dark:border-border/40 text-left">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-500/30 bg-amber-500/10 text-amber-500 shadow-sm">
              <Fuel className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <DialogTitle className="text-base sm:text-lg font-bold text-foreground leading-snug break-words">
                {vehicleName}
              </DialogTitle>

              {/* Efficiency Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {expense.isFullTank && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-semibold gap-0.5 px-1.5 py-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                    Full Tank
                  </Badge>
                )}
                {expense.computedEconomy && (
                  <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px] font-semibold px-1.5 py-0.5">
                    {expense.computedEconomy} km/L
                  </Badge>
                )}
                {expense.costPerKM && (
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px] font-semibold px-1.5 py-0.5">
                    PKR {expense.costPerKM}/km
                  </Badge>
                )}
                {expense.dailyDistanceDriven && (
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] font-semibold px-1.5 py-0.5">
                    {Math.round(expense.dailyDistanceDriven)} km/day
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Detailed breakdown of vehicle fuel refill record.
          </DialogDescription>
        </DialogHeader>

        {/* Structured Refill Details */}
        <div className="space-y-2.5 sm:space-y-3 pt-2">
          {/* Total Cost & Odometer Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Total Cost */}
            <div className="rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-2.5 sm:p-3 space-y-1 shadow-sm min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground font-medium">
                <Coins className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Total Cost</span>
              </div>
              <p className="text-sm sm:text-base font-extrabold font-mono text-foreground truncate">
                PKR {costFormatted}
              </p>
            </div>

            {/* Odometer */}
            <div className="rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-2.5 sm:p-3 space-y-1 shadow-sm min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground font-medium">
                <Gauge className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                <span>Odometer</span>
              </div>
              <p className="text-xs sm:text-base font-extrabold font-mono text-foreground truncate">
                {expense.odometer !== undefined && expense.odometer !== null
                  ? `${expense.odometer.toLocaleString()} km`
                  : "N/A"}
                {expense.distanceTraveled ? ` (+${expense.distanceTraveled} km)` : ""}
              </p>
            </div>
          </div>

          {/* Volume & Unit Price Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Fuel Quantity */}
            <div className="rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-2.5 sm:p-3 space-y-1 shadow-sm min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground font-medium">
                <Droplet className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>Quantity</span>
              </div>
              <p className="text-sm sm:text-base font-extrabold font-mono text-foreground truncate">
                {expense.quantity} L
              </p>
            </div>

            {/* Unit Price */}
            <div className="rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-2.5 sm:p-3 space-y-1 shadow-sm min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground font-medium">
                <TrendingUp className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                <span>Unit Price</span>
              </div>
              <p className="text-xs sm:text-base font-extrabold font-mono text-foreground truncate">
                PKR {expense.unitPrice}/L
              </p>
            </div>
          </div>

          {/* Refill Date (Full Width) */}
          <div className="w-full rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-2.5 sm:p-3 flex items-center justify-between shadow-sm min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Calendar className="h-3.5 w-3.5 text-purple-500 shrink-0" />
              <span>Refill Date</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-foreground font-mono truncate">
              {dateStr}
            </span>
          </div>

          {/* Gas Station Name */}
          {expense.stationName && (
            <div className="rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-2.5 sm:p-3 flex items-center gap-2.5 shadow-sm min-w-0">
              <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Gas Station</p>
                <p className="text-xs sm:text-sm font-bold text-foreground truncate">{expense.stationName}</p>
              </div>
            </div>
          )}

          {/* Notes & Remarks */}
          {expense.notes && (
            <div className="rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-2.5 sm:p-3 space-y-1 shadow-sm min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <FileText className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                <span>Notes & Remarks</span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed pt-0.5 whitespace-pre-wrap break-words">
                &quot;{expense.notes}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <DialogFooter className="pt-3 sm:pt-4 border-t-2 border-slate-300 dark:border-border/40 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleDeleteClick}
            className="gap-2 cursor-pointer border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl h-9 sm:h-10 px-3.5 text-xs sm:text-sm font-semibold transition-colors w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            Delete Entry
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer flex-1 sm:flex-initial rounded-xl h-9 sm:h-10 px-3.5 text-xs sm:text-sm font-semibold transition-colors border-slate-300 dark:border-border"
            >
              Close
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleEditClick}
              className="gap-2 cursor-pointer border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl h-9 sm:h-10 px-3.5 text-xs sm:text-sm font-semibold transition-colors flex-1 sm:flex-initial"
            >
              <Edit2 className="h-4 w-4 text-amber-500" />
              Edit Record
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
