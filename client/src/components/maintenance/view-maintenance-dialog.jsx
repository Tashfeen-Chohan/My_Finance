"use client";

import React from "react";
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
  Wrench,
  Droplet,
  Calendar,
  Gauge,
  Store,
  FileText,
  Edit2,
  Trash2,
  Car,
  Bell,
  Coins,
} from "lucide-react";
import { CATEGORY_BADGES, CATEGORY_LABELS } from "@/constants/maintenance";
import { ReceiptPreview } from "./receipt-preview";

export function ViewMaintenanceDialog({
  open,
  onOpenChange,
  maintenance = null,
  vehicles = [],
  onEdit,
  onDelete,
}) {
  if (!maintenance) return null;

  const vehicleId = maintenance.vehicleId?._id || maintenance.vehicleId;
  const vehicle = vehicles.find((v) => (v.id || v._id) === vehicleId);
  const vehicleName = vehicle
    ? vehicle.name
    : typeof maintenance.vehicleId === "object"
    ? maintenance.vehicleId?.name
    : "Vehicle";

  const isOilChange = maintenance.category === "oil_change";
  const rawCost = Number(maintenance.cost ?? maintenance.totalCost ?? 0);
  const costFormatted =
    rawCost % 1 === 0
      ? rawCost.toLocaleString()
      : rawCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const dateStr = maintenance.date
    ? new Date(maintenance.date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const handleEditClick = () => {
    onOpenChange(false);
    if (onEdit) onEdit(maintenance);
  };

  const handleDeleteClick = () => {
    onOpenChange(false);
    if (onDelete) onDelete(maintenance);
  };

  // Service Target Range
  const sMin = maintenance.nextServiceOdometerMin ?? (maintenance.nextServiceOdometerMax ? null : maintenance.nextServiceOdometer);
  const sMax = maintenance.nextServiceOdometerMax ?? (maintenance.nextServiceOdometerMin ? null : maintenance.nextServiceOdometer);
  const serviceRangeStr =
    sMin && sMax && sMin !== sMax
      ? `${sMin.toLocaleString()} - ${sMax.toLocaleString()} km`
      : sMin || sMax
      ? `${(sMin || sMax).toLocaleString()} km`
      : null;

  // Oil Change Target Range
  const oMin = maintenance.nextOilChangeOdometerMin ?? (maintenance.nextOilChangeOdometerMax ? null : maintenance.nextOilChangeOdometer);
  const oMax = maintenance.nextOilChangeOdometerMax ?? (maintenance.nextOilChangeOdometerMin ? null : maintenance.nextOilChangeOdometer);
  const oilRangeStr =
    oMin && oMax && oMin !== oMax
      ? `${oMin.toLocaleString()} - ${oMax.toLocaleString()} km`
      : oMin || oMax
      ? `${(oMin || oMax).toLocaleString()} km`
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[94vw] sm:w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
        {/* Header Section */}
        <DialogHeader className="space-y-2 pb-3 border-b-2 border-slate-300 dark:border-border/40 text-left">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-300 dark:border-border/50 shadow-sm ${CATEGORY_BADGES[maintenance.category] || CATEGORY_BADGES.other}`}>
              {isOilChange ? <Droplet className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <DialogTitle className="text-base sm:text-lg font-bold text-foreground leading-snug break-words">
                {maintenance.title}
              </DialogTitle>
              {/* Category first, then vehicle name */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <Badge className={`capitalize text-[10px] sm:text-[11px] font-semibold border ${CATEGORY_BADGES[maintenance.category] || CATEGORY_BADGES.other}`}>
                  {CATEGORY_LABELS[maintenance.category] || maintenance.category}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Car className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-foreground/90 font-semibold">{vehicleName}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Detailed breakdown of vehicle maintenance log entry.
          </DialogDescription>
        </DialogHeader>

        {/* Structured Log Details */}
        <div className="space-y-3 pt-2">
          {/* Total Cost & Odometer in 1 Line */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total Cost */}
            <div className="rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-3 space-y-1 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Coins className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Total Cost</span>
              </div>
              <p className="text-base font-extrabold font-mono text-foreground truncate">
                PKR {costFormatted}
              </p>
            </div>

            {/* Odometer */}
            <div className="rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-3 space-y-1 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Gauge className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                <span>Odometer</span>
              </div>
              <p className="text-base font-extrabold font-mono text-foreground truncate">
                {maintenance.odometer !== undefined && maintenance.odometer !== null
                  ? `${maintenance.odometer.toLocaleString()} km`
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Service Date in 1 Line (Full Width) */}
          <div className="w-full rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Calendar className="h-3.5 w-3.5 text-purple-500 shrink-0" />
              <span>Service Date</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-foreground font-mono">
              {dateStr}
            </span>
          </div>

          {/* Workshop / Service Provider */}
          {maintenance.serviceProvider && (
            <div className="rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-3 flex items-center gap-3 shadow-sm">
              <Store className="h-4 w-4 text-amber-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Service Provider</p>
                <p className="text-xs sm:text-sm font-bold text-foreground truncate">{maintenance.serviceProvider}</p>
              </div>
            </div>
          )}

          {/* Service Reminders Section */}
          {(serviceRangeStr || oilRangeStr) && (
            <div className="space-y-2 rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-3 sm:p-3.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Bell className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="uppercase tracking-wider text-[10px]">Service Reminders</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {serviceRangeStr && (
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-300 dark:border-border/30 bg-white dark:bg-background/60 p-2.5 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <Wrench className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                      <span>Next Service</span>
                    </div>
                    <span className="font-mono font-bold text-foreground">{serviceRangeStr}</span>
                  </div>
                )}
                {oilRangeStr && (
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-300 dark:border-border/30 bg-white dark:bg-background/60 p-2.5 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <Droplet className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>Next Oil Change</span>
                    </div>
                    <span className="font-mono font-bold text-foreground">{oilRangeStr}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes & Remarks */}
          {maintenance.notes && (
            <div className="rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-3 space-y-1 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <FileText className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                <span>Notes & Remarks</span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed pt-0.5 whitespace-pre-wrap break-words">
                &quot;{maintenance.notes}&quot;
              </p>
            </div>
          )}

          {/* Receipt Section (Displays only when viewing specific entry in view modal) */}
          {maintenance.receiptUrl && (
            <ReceiptPreview url={maintenance.receiptUrl} />
          )}
        </div>

        {/* Buttons Section */}
        <DialogFooter className="pt-4 border-t-2 border-slate-300 dark:border-border/40 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleDeleteClick}
            className="gap-2 cursor-pointer border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl h-10 px-4 text-xs sm:text-sm font-semibold transition-colors w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            Delete Entry
          </Button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer flex-1 sm:flex-initial rounded-xl h-10 px-4 text-xs sm:text-sm font-semibold transition-colors border-slate-300 dark:border-border"
            >
              Close
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleEditClick}
              className="gap-2 cursor-pointer border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl h-10 px-4 text-xs sm:text-sm font-semibold transition-colors flex-1 sm:flex-initial"
            >
              <Edit2 className="h-4 w-4 text-purple-500" />
              Edit Record
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
