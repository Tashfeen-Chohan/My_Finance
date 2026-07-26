"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Loader2 } from "lucide-react";

const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Please select a vehicle"),
  category: z.enum(["service", "repair", "part_replacement", "tire", "oil_change", "washing", "inspection", "other"]),
  title: z.string().min(1, "Title is required").max(150),
  odometer: z.coerce.number().min(0, "Odometer reading cannot be negative"),
  partsCost: z.coerce.number().min(0, "Parts cost cannot be negative").default(0),
  laborCost: z.coerce.number().min(0, "Labor cost cannot be negative").default(0),
  totalCost: z.coerce.number().min(0).optional(),
  serviceProvider: z.string().max(100).optional(),
  date: z.string().min(1, "Date is required"),
  nextServiceOdometer: z.coerce.number().min(0).optional().or(z.literal("")),
  nextServiceDate: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export function MaintenanceDialog({
  open,
  onOpenChange,
  maintenanceToEdit = null,
  vehicles = [],
  onSubmit,
}) {
  const isEditing = Boolean(maintenanceToEdit);

  const defaultVehicleId = vehicles.find((v) => v.isDefault)?.id || vehicles[0]?.id || "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      vehicleId: defaultVehicleId,
      category: "oil_change",
      title: "Engine Oil Change",
      odometer: 0,
      partsCost: 0,
      laborCost: 0,
      totalCost: 0,
      serviceProvider: "",
      date: new Date().toISOString().split("T")[0],
      nextServiceOdometer: "",
      nextServiceDate: "",
      notes: "",
    },
  });

  const selectedCategory = watch("category");
  const partsCostVal = watch("partsCost") || 0;
  const laborCostVal = watch("laborCost") || 0;

  // Auto calculate total cost
  useEffect(() => {
    const computedTotal = Number(partsCostVal) + Number(laborCostVal);
    setValue("totalCost", computedTotal);
  }, [partsCostVal, laborCostVal, setValue]);

  // Set default title based on selected category when adding new record
  useEffect(() => {
    if (!isEditing) {
      if (selectedCategory === "oil_change") setValue("title", "Engine Oil & Filter Change");
      else if (selectedCategory === "service") setValue("title", "Periodic Maintenance Service");
      else if (selectedCategory === "tire") setValue("title", "Tire Rotation & Alignment");
      else if (selectedCategory === "washing") setValue("title", "Car Wash & Detailing");
      else if (selectedCategory === "inspection") setValue("title", "General Inspection");
      else if (selectedCategory === "repair") setValue("title", "Vehicle Repair");
      else if (selectedCategory === "part_replacement") setValue("title", "Part Replacement");
    }
  }, [selectedCategory, isEditing, setValue]);

  useEffect(() => {
    if (maintenanceToEdit) {
      const vId = maintenanceToEdit.vehicleId?._id || maintenanceToEdit.vehicleId || defaultVehicleId;
      const dateStr = maintenanceToEdit.date
        ? new Date(maintenanceToEdit.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      const nextDateStr = maintenanceToEdit.nextServiceDate
        ? new Date(maintenanceToEdit.nextServiceDate).toISOString().split("T")[0]
        : "";

      reset({
        vehicleId: String(vId),
        category: maintenanceToEdit.category || "service",
        title: maintenanceToEdit.title || "",
        odometer: maintenanceToEdit.odometer || 0,
        partsCost: maintenanceToEdit.partsCost || 0,
        laborCost: maintenanceToEdit.laborCost || 0,
        totalCost: maintenanceToEdit.totalCost || 0,
        serviceProvider: maintenanceToEdit.serviceProvider || "",
        date: dateStr,
        nextServiceOdometer: maintenanceToEdit.nextServiceOdometer || "",
        nextServiceDate: nextDateStr,
        notes: maintenanceToEdit.notes || "",
      });
    } else {
      reset({
        vehicleId: defaultVehicleId,
        category: "oil_change",
        title: "Engine Oil & Filter Change",
        odometer: 0,
        partsCost: 0,
        laborCost: 0,
        totalCost: 0,
        serviceProvider: "",
        date: new Date().toISOString().split("T")[0],
        nextServiceOdometer: "",
        nextServiceDate: "",
        notes: "",
      });
    }
  }, [maintenanceToEdit, open, reset, defaultVehicleId]);

  const onFormSubmit = async (data) => {
    const formattedData = {
      ...data,
      nextServiceOdometer: data.nextServiceOdometer ? Number(data.nextServiceOdometer) : undefined,
      nextServiceDate: data.nextServiceDate ? new Date(data.nextServiceDate).toISOString() : undefined,
    };
    await onSubmit(formattedData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto border-border/40 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wrench className="h-5 w-5" />
            </div>
            <DialogTitle>{isEditing ? "Edit Maintenance Record" : "Log Vehicle Maintenance"}</DialogTitle>
          </div>
          <DialogDescription>
            Record oil changes, periodic services, part replacements, and reminder targets.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Vehicle Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Select Vehicle *</label>
              <Select
                value={watch("vehicleId")}
                onValueChange={(val) => setValue("vehicleId", val, { shouldValidate: true })}
              >
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id || v._id} value={String(v.id || v._id)}>
                      {v.name} ({v.make} {v.model})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleId && <p className="text-xs text-destructive">{errors.vehicleId.message}</p>}
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Category *</label>
              <Select
                value={watch("category")}
                onValueChange={(val) => setValue("category", val, { shouldValidate: true })}
              >
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oil_change">Oil Change</SelectItem>
                  <SelectItem value="service">Periodic Service</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="part_replacement">Part Replacement</SelectItem>
                  <SelectItem value="tire">Tire Rotation / Service</SelectItem>
                  <SelectItem value="washing">Wash & Detailing</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Service Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Service Title *</label>
            <Input
              placeholder="e.g. Synthetic Oil Change + Filter"
              {...register("title")}
              className="bg-background/50 border-border/50"
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Odometer */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Current Odometer (km) *</label>
              <Input
                type="number"
                placeholder="e.g. 45000"
                {...register("odometer")}
                className="bg-background/50 border-border/50"
              />
              {errors.odometer && <p className="text-xs text-destructive">{errors.odometer.message}</p>}
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Service Date *</label>
              <Input type="date" {...register("date")} className="bg-background/50 border-border/50" />
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="rounded-xl border border-border/50 bg-secondary/20 p-3 space-y-3">
            <p className="text-xs font-bold text-foreground">Cost Breakdown (PKR)</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Parts Cost</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("partsCost")}
                  className="bg-background/50 border-border/50 h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Labor Cost</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("laborCost")}
                  className="bg-background/50 border-border/50 h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-semibold text-foreground">Total Cost</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("totalCost")}
                  readOnly
                  className="bg-background/80 border-border/50 h-8 text-xs font-bold text-emerald-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Service Provider */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Service Workshop / Provider</label>
              <Input
                placeholder="e.g. Toyota Authorized Service"
                {...register("serviceProvider")}
                className="bg-background/50 border-border/50"
              />
            </div>

            {/* Next Service Odometer Reminder */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Next Service Odometer (Reminder)</label>
              <Input
                type="number"
                placeholder="e.g. 50000"
                {...register("nextServiceOdometer")}
                className="bg-background/50 border-border/50"
              />
            </div>
          </div>

          {/* Next Service Date Reminder */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Next Service Date (Reminder)</label>
            <Input type="date" {...register("nextServiceDate")} className="bg-background/50 border-border/50" />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Notes / Remarks</label>
            <Input
              placeholder="e.g. Replaced oil filter with OEM Part #12345"
              {...register("notes")}
              className="bg-background/50 border-border/50"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2 cursor-pointer">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Record Maintenance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
