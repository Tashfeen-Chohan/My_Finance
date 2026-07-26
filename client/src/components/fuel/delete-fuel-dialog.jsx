"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function DeleteFuelDialog({ open, onOpenChange, expenseToDelete, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    try {
      await onConfirm(expenseToDelete.id || expenseToDelete._id);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to delete fuel log:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:rounded-2xl backdrop-blur-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Delete Fuel Log</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete this fuel refill record?
            {expenseToDelete && (
              <span className="block mt-2 font-medium text-foreground">
                {expenseToDelete.quantity} L — PKR {expenseToDelete.totalCost?.toLocaleString()} (Odometer: {expenseToDelete.odometer} km)
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
