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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings2, Gauge, AlertTriangle, Check, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_PREFERENCES, DEFAULT_FULL_TANK_DISTANCE, DEFAULT_RESERVE_DISTANCE } from "@/constants/preferences";

export function PreferencesDialog({
  open,
  onOpenChange,
  preferences = DEFAULT_PREFERENCES,
  onSave,
  isLoading = false,
}) {
  const { toast } = useToast();

  const [fullTankDistance, setFullTankDistance] = useState(
    Number(preferences?.fullTankDistance) || DEFAULT_FULL_TANK_DISTANCE
  );
  const [reserveDistance, setReserveDistance] = useState(
    Number(preferences?.reserveDistance) || DEFAULT_RESERVE_DISTANCE
  );

  // Sync state during render phase when props change
  const [prevProps, setPrevProps] = useState({ preferences, open });
  if (prevProps.preferences !== preferences || prevProps.open !== open) {
    setPrevProps({ preferences, open });
    setFullTankDistance(Number(preferences?.fullTankDistance) || DEFAULT_FULL_TANK_DISTANCE);
    setReserveDistance(Number(preferences?.reserveDistance) || DEFAULT_RESERVE_DISTANCE);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const full = Number(fullTankDistance);
    const res = Number(reserveDistance);

    if (isNaN(full) || full <= 0) {
      toast({
        title: "Invalid Input",
        description: "Full tank distance must be a positive number",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(res) || res < 0) {
      toast({
        title: "Invalid Input",
        description: "Reserve distance cannot be negative",
        variant: "destructive",
      });
      return;
    }

    if (res >= full) {
      toast({
        title: "Invalid Input",
        description: "Reserve distance must be less than full tank distance",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSave({ fullTankDistance: full, reserveDistance: res });
      toast({
        title: "Preferences Saved",
        description: "Fuel range and reserve preferences updated in DB and synced locally",
        variant: "success",
      });
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Update Failed",
        description: err instanceof Error ? err.message : "Failed to save preferences",
        variant: "destructive",
      });
    }
  };

  const handleResetDefaults = () => {
    setFullTankDistance(DEFAULT_FULL_TANK_DISTANCE);
    setReserveDistance(DEFAULT_RESERVE_DISTANCE);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[92vw] sm:w-full p-4 sm:p-6 rounded-2xl">
        <DialogHeader className="space-y-2 pb-3 border-b border-border/40 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                Range Preferences
              </DialogTitle>

              <DialogDescription className="text-xs text-muted-foreground">
                Configure your vehicle full tank distance & reserve threshold for live reminders
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          {/* Full Tank Distance Input */}
          <div className="space-y-1.5">
            <Label htmlFor="fullTankDistance" className="text-xs font-semibold flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Full Tank Distance (km)</span>
            </Label>
            <Input
              id="fullTankDistance"
              type="number"
              min="1"
              step="1"
              value={fullTankDistance}
              onChange={(e) => setFullTankDistance(e.target.value)}
              placeholder={`e.g. ${DEFAULT_FULL_TANK_DISTANCE}`}
              className="rounded-xl font-mono text-sm"
              required
            />
            <p className="text-[11px] text-muted-foreground">
              Total distance in kilometers covered by a 100% full fuel tank.
            </p>
          </div>

          {/* Reserve Distance Input */}
          <div className="space-y-1.5">
            <Label htmlFor="reserveDistance" className="text-xs font-semibold flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span>Reserve Threshold Distance (km)</span>
            </Label>
            <Input
              id="reserveDistance"
              type="number"
              min="0"
              step="1"
              value={reserveDistance}
              onChange={(e) => setReserveDistance(e.target.value)}
              placeholder={`e.g. ${DEFAULT_RESERVE_DISTANCE}`}
              className="rounded-xl font-mono text-sm"
              required
            />
            <p className="text-[11px] text-muted-foreground">
              Remaining range in kilometers when the fuel reserve indicator triggers.
            </p>
          </div>

          <DialogFooter className="pt-3 border-t border-border/40 flex flex-col-reverse sm:flex-row items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetDefaults}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground w-full sm:w-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Defaults
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="flex-1 sm:flex-initial rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-xl flex-1 sm:flex-initial text-xs"
              >
                <Check className="h-4 w-4" />
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
