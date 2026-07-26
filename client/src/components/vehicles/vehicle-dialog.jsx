"use client";

import React, { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Fuel, Gauge, Star, Image as ImageIcon } from "lucide-react";

const PRESET_IMAGES = [
  { label: "Black Sedan", url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80" },
  { label: "White SUV", url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80" },
  { label: "Blue EV", url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80" },
  { label: "Red Hatchback", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80" },
];

export function VehicleDialog({ open, onOpenChange, vehicleToEdit, onSubmit }) {
  const isEditing = Boolean(vehicleToEdit);

  const [formData, setFormData] = useState({
    name: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    vin: "",
    fuelType: "petrol",
    mileageUnit: "km",
    initialOdometer: 0,
    currentOdometer: 0,
    currency: "PKR",
    photoUrl: PRESET_IMAGES[0].url,
    isDefault: false,
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        name: vehicleToEdit.name || "",
        make: vehicleToEdit.make || "",
        model: vehicleToEdit.model || "",
        year: vehicleToEdit.year || new Date().getFullYear(),
        licensePlate: vehicleToEdit.licensePlate || "",
        vin: vehicleToEdit.vin || "",
        fuelType: vehicleToEdit.fuelType || "petrol",
        mileageUnit: vehicleToEdit.mileageUnit || "km",
        initialOdometer: vehicleToEdit.initialOdometer || 0,
        currentOdometer: vehicleToEdit.currentOdometer || 0,
        currency: vehicleToEdit.currency || "PKR",
        photoUrl: vehicleToEdit.photoUrl || PRESET_IMAGES[0].url,
        isDefault: Boolean(vehicleToEdit.isDefault),
        notes: vehicleToEdit.notes || "",
      });
    } else {
      setFormData({
        name: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        licensePlate: "",
        vin: "",
        fuelType: "petrol",
        mileageUnit: "km",
        initialOdometer: 0,
        currentOdometer: 0,
        currency: "PKR",
        photoUrl: PRESET_IMAGES[0].url,
        isDefault: false,
        notes: "",
      });
    }
  }, [vehicleToEdit, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to save vehicle:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-2xl backdrop-blur-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Car className="h-5 w-5" />
            <DialogTitle>{isEditing ? "Edit Vehicle Details" : "Register New Vehicle"}</DialogTitle>
          </div>
          <DialogDescription>
            Configure vehicle specifications, odometer, fuel type, and mileage preferences.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmitForm} className="space-y-5 py-2">
          {/* Main Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Vehicle Display Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Honda Civic Oriel"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="make">Make (Manufacturer) *</Label>
              <Input
                id="make"
                name="make"
                placeholder="e.g. Honda"
                value={formData.make}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model Name *</Label>
              <Input
                id="model"
                name="model"
                placeholder="e.g. Civic"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Manufacturing Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 2}
                value={formData.year}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate Number</Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                placeholder="e.g. LEA-1234"
                value={formData.licensePlate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Fuel & Mileage Config */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-border/40">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Fuel className="h-4 w-4 text-amber-500" />
                Fuel Engine Type
              </Label>
              <Select
                value={formData.fuelType}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, fuelType: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petrol">Petrol / Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric (EV)</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="cng">CNG / LPG</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-primary" />
                Mileage Unit
              </Label>
              <Select
                value={formData.mileageUnit}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, mileageUnit: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Kilometers (km)</SelectItem>
                  <SelectItem value="miles">Miles (mi)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialOdometer">Initial Odometer ({formData.mileageUnit})</Label>
              <Input
                id="initialOdometer"
                name="initialOdometer"
                type="number"
                min="0"
                value={formData.initialOdometer}
                onChange={handleChange}
                disabled={isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentOdometer">Current Odometer ({formData.mileageUnit}) *</Label>
              <Input
                id="currentOdometer"
                name="currentOdometer"
                type="number"
                min={formData.initialOdometer}
                value={formData.currentOdometer}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Photo & Presets */}
          <div className="space-y-3 pt-2 border-t border-border/40">
            <Label className="flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-purple-400" />
              Vehicle Image URL
            </Label>
            <Input
              id="photoUrl"
              name="photoUrl"
              placeholder="https://images.unsplash.com/..."
              value={formData.photoUrl}
              onChange={handleChange}
            />

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Or pick a preset:</span>
              {PRESET_IMAGES.map((preset) => (
                <Button
                  key={preset.url}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setFormData((prev) => ({ ...prev, photoUrl: preset.url }))}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Default Switch & Notes */}
          <div className="space-y-4 pt-2 border-t border-border/40">
            <div className="flex items-center gap-3 rounded-lg border p-3 bg-secondary/30">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <Label htmlFor="isDefault" className="cursor-pointer flex items-center gap-1.5 text-sm font-medium">
                <Star className="h-4 w-4 text-amber-500" />
                Set as Primary / Default Vehicle
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes / Observations</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Optional vehicle notes..."
                rows={3}
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Register Vehicle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
