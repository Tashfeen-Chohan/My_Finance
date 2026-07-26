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
import { Trash2, Loader2 } from "lucide-react";

export function DeleteMaintenanceDialog({ open, onOpenChange, maintenanceToDelete, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!maintenanceToDelete) return;
    setIsDeleting(true);
    try {
      const id = maintenanceToDelete.id || maintenanceToDelete._id;
      await onConfirm(id);
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/40 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            <DialogTitle>Delete Maintenance Record</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete &quot;{maintenanceToDelete?.title}&quot;? This action will remove the expense log from your records.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting} className="gap-2 cursor-pointer">
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
