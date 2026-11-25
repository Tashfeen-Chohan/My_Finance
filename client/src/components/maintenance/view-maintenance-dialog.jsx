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
  Edit2,
  Trash2,
  Bell,
} from "lucide-react";
import { CATEGORY_LABELS } from "@/constants/maintenance";
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

  const sMin = maintenance.nextServiceOdometerMin ?? (maintenance.nextServiceOdometerMax ? null : maintenance.nextServiceOdometer);
  const sMax = maintenance.nextServiceOdometerMax ?? (maintenance.nextServiceOdometerMin ? null : maintenance.nextServiceOdometer);
  const serviceRangeStr =
    sMin && sMax && sMin !== sMax
      ? `${sMin.toLocaleString()} – ${sMax.toLocaleString()} km`
      : sMin || sMax
      ? `${(sMin || sMax).toLocaleString()} km`
      : null;

  const oMin = maintenance.nextOilChangeOdometerMin ?? (maintenance.nextOilChangeOdometerMax ? null : maintenance.nextOilChangeOdometer);
  const oMax = maintenance.nextOilChangeOdometerMax ?? (maintenance.nextOilChangeOdometerMin ? null : maintenance.nextOilChangeOdometer);
  const oilRangeStr =
    oMin && oMax && oMin !== oMax
      ? `${oMin.toLocaleString()} – ${oMax.toLocaleString()} km`
      : oMin || oMax
      ? `${(oMin || oMax).toLocaleString()} km`
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-border text-left pr-8">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              {isOilChange ? <Droplet className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <DialogTitle className="text-base sm:text-lg font-semibold text-foreground leading-snug break-words">
                {maintenance.title}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="capitalize text-[11px] font-medium text-sky-600 dark:text-sky-400">
                  {CATEGORY_LABELS[maintenance.category] || maintenance.category}
                </Badge>
                <span className="text-xs font-medium text-muted-foreground">{vehicleName}</span>
              </div>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Detailed breakdown of vehicle maintenance log entry.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-4 py-4">
          {/* Summary Strip */}
          <div className="rounded-xl border border-border bg-secondary/40 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Cost</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums mt-0.5">
                PKR {costFormatted}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium">Odometer</p>
              <p className="text-sm sm:text-base font-semibold text-foreground tabular-nums mt-0.5">
                {maintenance.odometer !== undefined && maintenance.odometer !== null
                  ? `${maintenance.odometer.toLocaleString()} km`
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Specification Rows */}
          <div className="rounded-xl border border-border divide-y divide-border text-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-muted-foreground">Service Date</span>
              <span className="font-medium text-foreground">{dateStr}</span>
            </div>
            {maintenance.serviceProvider && (
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-xs text-muted-foreground shrink-0">Workshop</span>
                <span className="font-medium text-foreground text-right truncate">{maintenance.serviceProvider}</span>
              </div>
            )}
          </div>

          {/* Service Reminders */}
          {(serviceRangeStr || oilRangeStr) && (
            <div className="rounded-xl border border-border divide-y divide-border bg-secondary/20">
              <div className="px-4 py-2.5 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <Bell className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Next Service Targets</span>
              </div>
              {serviceRangeStr && (
                <div className="flex items-center justify-between px-4 py-2.5 text-xs">
                  <span className="text-muted-foreground">Next Service</span>
                  <span className="font-semibold text-foreground tabular-nums">{serviceRangeStr}</span>
                </div>
              )}
              {oilRangeStr && (
                <div className="flex items-center justify-between px-4 py-2.5 text-xs">
                  <span className="text-muted-foreground">Next Oil Change</span>
                  <span className="font-semibold text-foreground tabular-nums">{oilRangeStr}</span>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {maintenance.notes && (
            <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-1">
              <p className="text-[11px] font-medium text-muted-foreground">Notes</p>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {maintenance.notes}
              </p>
            </div>
          )}

          {/* Receipt */}
          {maintenance.receiptUrl && (
            <ReceiptPreview url={maintenance.receiptUrl} />
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
              className="gap-1.5 flex-1 sm:flex-initial bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950"
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
