"use client";

import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { Wrench, Droplet, Loader2 } from "lucide-react";
import { MAINTENANCE_CATEGORIES, DEFAULT_CATEGORY_TITLES } from "@/constants/maintenance";

const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Please select a vehicle"),
  category: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required").max(150),
  odometer: z.coerce.number().min(0, "Odometer reading cannot be negative"),
  cost: z.coerce.number().min(0, "Cost cannot be negative"),
  serviceProvider: z.string().max(100).optional(),
  date: z.string().min(1, "Date is required"),
  nextServiceOdometerMin: z.coerce.number().min(0).optional().or(z.literal("")),
  nextServiceOdometerMax: z.coerce.number().min(0).optional().or(z.literal("")),
  nextOilChangeOdometerMin: z.coerce.number().min(0).optional().or(z.literal("")),
  nextOilChangeOdometerMax: z.coerce.number().min(0).optional().or(z.literal("")),
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
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      vehicleId: defaultVehicleId,
      category: "oil_change",
      title: "Engine Oil & Filter Change",
      odometer: 0,
      cost: 0,
      serviceProvider: "",
      date: new Date().toISOString().split("T")[0],
      nextServiceOdometerMin: "",
      nextServiceOdometerMax: "",
      nextOilChangeOdometerMin: "",
      nextOilChangeOdometerMax: "",
      notes: "",
    },
  });

  const vehicleId = useWatch({ control, name: "vehicleId" });
  const category = useWatch({ control, name: "category" });

  const handleCategoryChange = (val) => {
    setValue("category", val, { shouldValidate: true });
    if (DEFAULT_CATEGORY_TITLES[val]) {
      setValue("title", DEFAULT_CATEGORY_TITLES[val], { shouldValidate: true });
    }
  };

  useEffect(() => {
    if (maintenanceToEdit) {
      const vId = maintenanceToEdit.vehicleId?._id || maintenanceToEdit.vehicleId || defaultVehicleId;
      const dateStr = maintenanceToEdit.date
        ? new Date(maintenanceToEdit.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      reset({
        vehicleId: String(vId),
        category: maintenanceToEdit.category || "service",
        title: maintenanceToEdit.title || "",
        odometer: maintenanceToEdit.odometer || 0,
        cost: maintenanceToEdit.cost ?? maintenanceToEdit.totalCost ?? 0,
        serviceProvider: maintenanceToEdit.serviceProvider || "",
        date: dateStr,
        nextServiceOdometerMin: maintenanceToEdit.nextServiceOdometerMin ?? maintenanceToEdit.nextServiceOdometer ?? "",
        nextServiceOdometerMax: maintenanceToEdit.nextServiceOdometerMax ?? maintenanceToEdit.nextServiceOdometer ?? "",
        nextOilChangeOdometerMin: maintenanceToEdit.nextOilChangeOdometerMin ?? maintenanceToEdit.nextOilChangeOdometer ?? "",
        nextOilChangeOdometerMax: maintenanceToEdit.nextOilChangeOdometerMax ?? maintenanceToEdit.nextOilChangeOdometer ?? "",
        notes: maintenanceToEdit.notes || "",
      });
    } else {
      reset({
        vehicleId: defaultVehicleId,
        category: "oil_change",
        title: "Engine Oil & Filter Change",
        odometer: 0,
        cost: 0,
        serviceProvider: "",
        date: new Date().toISOString().split("T")[0],
        nextServiceOdometerMin: "",
        nextServiceOdometerMax: "",
        nextOilChangeOdometerMin: "",
        nextOilChangeOdometerMax: "",
        notes: "",
      });
    }
  }, [maintenanceToEdit, open, reset, defaultVehicleId]);

  const onFormSubmit = async (data) => {
    const parseNumOrNull = (val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    };

    const sMin = parseNumOrNull(data.nextServiceOdometerMin);
    const sMax = parseNumOrNull(data.nextServiceOdometerMax);
    const oMin = parseNumOrNull(data.nextOilChangeOdometerMin);
    const oMax = parseNumOrNull(data.nextOilChangeOdometerMax);

    const formattedData = {
      ...data,
      cost: Number(data.cost),
      nextServiceOdometerMin: sMin,
      nextServiceOdometerMax: sMax,
      nextServiceOdometer: sMax ?? sMin ?? null,
      nextOilChangeOdometerMin: oMin,
      nextOilChangeOdometerMax: oMax,
      nextOilChangeOdometer: oMax ?? oMin ?? null,
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
            Record oil changes, periodic services, workshop repairs, and reminder target ranges.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Vehicle Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Select Vehicle *</label>
              <Select
                value={vehicleId}
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
                value={category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {MAINTENANCE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
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

            {/* Service Cost */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Service Cost (PKR) *</label>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 4500"
                {...register("cost")}
                className="bg-background/50 border-border/50 font-medium"
              />
              {errors.cost && <p className="text-xs text-destructive">{errors.cost.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Service Date *</label>
              <Input type="date" {...register("date")} className="bg-background/50 border-border/50" />
            </div>

            {/* Service Provider */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Service Workshop / Provider</label>
              <Input
                placeholder="e.g. Toyota Authorized Service"
                {...register("serviceProvider")}
                className="bg-background/50 border-border/50"
              />
            </div>
          </div>

          {/* Reminder Targets Section */}
          <div className="space-y-3 pt-2 border-t border-border/40">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">Reminder Target Ranges</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Service Reminder Target Range */}
              <div className="rounded-xl border border-border/50 bg-background/30 p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Wrench className="h-3.5 w-3.5 text-blue-400" />
                  <span>Next Service Target Range</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground">From (km)</label>
                    <Input
                      type="number"
                      placeholder="45000"
                      {...register("nextServiceOdometerMin")}
                      className="bg-background/50 border-border/50 h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground">To (km)</label>
                    <Input
                      type="number"
                      placeholder="50000"
                      {...register("nextServiceOdometerMax")}
                      className="bg-background/50 border-border/50 h-8 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Oil Change Reminder Target Range */}
              <div className="rounded-xl border border-border/50 bg-background/30 p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Droplet className="h-3.5 w-3.5 text-amber-500" />
                  <span>Next Oil Change Range</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground">From (km)</label>
                    <Input
                      type="number"
                      placeholder="40000"
                      {...register("nextOilChangeOdometerMin")}
                      className="bg-background/50 border-border/50 h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground">To (km)</label>
                    <Input
                      type="number"
                      placeholder="45000"
                      {...register("nextOilChangeOdometerMax")}
                      className="bg-background/50 border-border/50 h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Notes / Remarks</label>
            <Input
              placeholder="e.g. Engine oil and oil filter replaced"
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
