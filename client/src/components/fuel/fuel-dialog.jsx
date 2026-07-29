"use client";

import { useState } from "react";
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
import { Fuel, Gauge, DollarSign, Calendar, MapPin } from "lucide-react";
import { getInitialFuelFormData } from "@/utils/fuel-utils";

function FuelForm({ onOpenChange, expenseToEdit, vehicles = [], onSubmit }) {
  const isEditing = Boolean(expenseToEdit);
  const [formData, setFormData] = useState(() => getInitialFuelFormData(expenseToEdit, vehicles));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "quantity") {
        const qty = Number(value) || 0;
        const price = Number(prev.unitPrice) || 0;
        if (price > 0) {
          next.totalCost = Number((qty * price).toFixed(2));
        }
      } else if (name === "unitPrice") {
        const price = Number(value) || 0;
        const qty = Number(prev.quantity) || 0;
        if (qty > 0) {
          next.totalCost = Number((qty * price).toFixed(2));
        }
      } else if (name === "totalCost") {
        const total = Number(value) || 0;
        const price = Number(prev.unitPrice) || 0;
        const qty = Number(prev.quantity) || 0;
        if (price > 0) {
          next.quantity = Number((total / price).toFixed(2));
        } else if (qty > 0) {
          next.unitPrice = Number((total / qty).toFixed(2));
        }
      }

      return next;
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to save fuel expense:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2 text-amber-500">
          <Fuel className="h-5 w-5" />
          <DialogTitle>{isEditing ? "Edit Fuel Log" : "Log Fuel Refill"}</DialogTitle>
        </div>
        <DialogDescription>
          Record fuel refill details to track mileage efficiency and fuel spending.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmitForm} className="space-y-4 py-2">
        {/* Vehicle Select */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Fuel className="h-4 w-4 text-primary" />
            Select Vehicle *
          </Label>
          <Select
            value={formData.vehicleId}
            onValueChange={(val) => setFormData((prev) => ({ ...prev, vehicleId: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((v) => (
                <SelectItem key={v.id || v._id} value={v.id || v._id}>
                  {v.name} ({v.licensePlate || v.make})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-blue-400" />
              Refill Date *
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="odometer" className="flex items-center gap-1.5">
              <Gauge className="h-4 w-4 text-emerald-400" />
              Odometer Reading *
            </Label>
            <Input
              id="odometer"
              name="odometer"
              type="number"
              min="0"
              value={formData.odometer}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (Liters) *</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              step="0.01"
              min="0.1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitPrice">Unit Price (PKR/L) *</Label>
            <Input
              id="unitPrice"
              name="unitPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.unitPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalCost" className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Total Cost (PKR) *
            </Label>
            <Input
              id="totalCost"
              name="totalCost"
              type="number"
              step="0.01"
              value={formData.totalCost}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-border/40">
          <div className="space-y-2">
            <Label htmlFor="stationName" className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-purple-400" />
              Gas Station Name
            </Label>
            <Input
              id="stationName"
              name="stationName"
              placeholder="e.g. Total Parco, PSO Main Blvd"
              value={formData.stationName}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="isFullTank"
              name="isFullTank"
              checked={formData.isFullTank}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
            />
            <Label htmlFor="isFullTank" className="cursor-pointer text-sm font-medium">
              Full Tank Fill-up
            </Label>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border/40">
          <Label htmlFor="notes">Notes / Observations</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="e.g. Highway driving, Shell V-Power..."
            rows={2}
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !formData.vehicleId}>
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Log Refill"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function FuelDialog({ open, onOpenChange, expenseToEdit, vehicles = [], onSubmit }) {
  const key = expenseToEdit ? expenseToEdit.id || expenseToEdit._id : open ? "new" : "closed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto sm:rounded-2xl backdrop-blur-2xl">
        <FuelForm
          key={key}
          onOpenChange={onOpenChange}
          expenseToEdit={expenseToEdit}
          vehicles={vehicles}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
