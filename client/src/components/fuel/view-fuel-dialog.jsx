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
  Edit2,
  Trash2,
  CheckCircle2,
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
      <DialogContent className="max-w-lg p-0">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-border text-left pr-8">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Fuel className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <DialogTitle className="text-base sm:text-lg font-semibold text-foreground leading-snug break-words">
                  {vehicleName}
                </DialogTitle>
                {expense.isFullTank && (
                  <CheckCircle2
                    className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0"
                    aria-label="Full Tank"
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {expense.computedEconomy && (
                  <Badge
                    variant="outline"
                    className="text-[11px] font-semibold tabular-nums bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20"
                  >
                    {expense.computedEconomy} km/L
                  </Badge>
                )}
                {expense.costPerKM && (
                  <Badge variant="secondary" className="text-[11px] font-medium tabular-nums">
                    PKR {expense.costPerKM}/km
                  </Badge>
                )}
                {expense.dailyDistanceDriven && (
                  <Badge variant="secondary" className="text-[11px] font-medium tabular-nums">
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

        {/* Body */}
        <div className="space-y-4 py-4">
          {/* Summary Strip */}
          <div className="rounded-xl border border-border bg-secondary/40 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Paid</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums mt-0.5">
                PKR {costFormatted}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium">Odometer</p>
              <p className="text-sm sm:text-base font-semibold text-foreground tabular-nums mt-0.5">
                {expense.odometer !== undefined && expense.odometer !== null
                  ? `${expense.odometer.toLocaleString()} km`
                  : "N/A"}
              </p>
              {expense.distanceTraveled ? (
                <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium tabular-nums">
                  +{expense.distanceTraveled} km trip
                </p>
              ) : null}
            </div>
          </div>

          {/* Specification Rows */}
          <div className="rounded-xl border border-border divide-y divide-border text-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-muted-foreground">Fuel Quantity</span>
              <span className="font-semibold text-foreground tabular-nums">{expense.quantity} L</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-muted-foreground">Unit Price</span>
              <span className="font-semibold text-foreground tabular-nums">PKR {expense.unitPrice}/L</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-muted-foreground">Refill Date</span>
              <span className="font-medium text-foreground">{dateStr}</span>
            </div>
            {expense.stationName && (
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-xs text-muted-foreground shrink-0">Gas Station</span>
                <span className="font-medium text-foreground text-right truncate">{expense.stationName}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {expense.notes && (
            <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-1">
              <p className="text-[11px] font-medium text-muted-foreground">Notes</p>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {expense.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="pt-4 border-t border-border flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleDeleteClick}
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-initial"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={handleEditClick}
              className="gap-1.5 flex-1 sm:flex-initial bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
