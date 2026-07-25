"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { InteractiveCard, MetricCard } from "@/components/ui/card";
import { MaterialInput } from "@/components/ui/material-input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
} from "@/components/ui/bottom-sheet";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SkeletonList } from "@/components/common/skeleton-layouts";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  Plus,
  Car,
  Fuel,
  Sparkles,
  Search,
  Bell,
  ChevronRight,
  Layers,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function DesignSystemPage() {
  const { toast } = useToast();
  const [materialText, setMaterialText] = useState("");
  const [selectValue, setSelectValue] = useState("petrol");

  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-16">
      {/* Design System Header */}
      <div className="border-border space-y-2 border-b pb-6">
        <div className="flex items-center gap-2">
          <Badge variant="success">Design System Ready</Badge>
          <Badge variant="outline" className="font-mono text-xs">
            v1.0
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Design System & Component Library</h1>
        <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
          Material-inspired text fields, responsive mobile-first bottom sheets, touch-optimized
          buttons, dialogs, drawers, badges, toasts, skeletons, empty states, and error states built
          with semantic CSS tokens and theme variables.
        </p>
      </div>

      {/* 1. Material Text Fields */}
      <section className="space-y-4">
        <h2 className="text-foreground flex items-center gap-2 text-xl font-bold tracking-tight">
          <Sparkles className="text-primary h-5 w-5" />
          1. Material-Inspired Text Fields
        </h2>
        <div className="border-border bg-card grid grid-cols-1 gap-6 rounded-2xl border p-6 md:grid-cols-2">
          <MaterialInput
            label="Vehicle Name (Outlined)"
            helperText="Enter name e.g. Honda Civic"
            value={materialText}
            onChange={(e) => setMaterialText(e.target.value)}
            leadingIcon={<Car className="h-4 w-4" />}
          />
          <MaterialInput
            label="Fuel Station (Filled)"
            variant="filled"
            helperText="Optional station name"
            leadingIcon={<Fuel className="h-4 w-4" />}
          />
          <MaterialInput
            label="License Plate (Error State)"
            error="License plate already registered"
            defaultValue="ABC-1234"
          />
          <MaterialInput
            label="Search Filter"
            placeholder="Type to filter..."
            leadingIcon={<Search className="h-4 w-4" />}
            trailingIcon={<Badge variant="secondary">Filter</Badge>}
          />
        </div>
      </section>

      {/* 2. Buttons & FAB */}
      <section className="space-y-4">
        <h2 className="text-foreground flex items-center gap-2 text-xl font-bold tracking-tight">
          <Layers className="text-primary h-5 w-5" />
          2. Buttons & Floating Action Buttons (FAB)
        </h2>
        <div className="border-border bg-card space-y-6 rounded-2xl border p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="default">Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button isLoading>Loading</Button>
            <Button leftIcon={<Plus className="h-4 w-4" />}>Add Record</Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>

          <div className="border-border border-t pt-4">
            <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
              Floating Action Button (FAB)
            </h3>
            <div className="flex items-center gap-4">
              <Button variant="fab" size="fab-default" title="Quick Add Action">
                <Plus className="h-6 w-6" />
              </Button>
              <span className="text-muted-foreground text-xs">
                (Look at bottom right corner for fixed FAB positioning)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Cards & Metric Cards */}
      <section className="space-y-4">
        <h2 className="text-foreground text-xl font-bold tracking-tight">
          3. Cards & Metric Displays
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard
            title="Total Expenses"
            value="$1,248.50"
            description="Across 3 vehicles this month"
            icon={<Fuel className="h-5 w-5" />}
            trend={{ value: "+12.4%", isPositive: true }}
          />
          <MetricCard
            title="Fuel Efficiency"
            value="14.2 km/L"
            description="Average for Honda Civic"
            icon={<Sparkles className="h-5 w-5" />}
            trend={{ value: "-2.1%", isPositive: false }}
          />
          <InteractiveCard className="flex flex-col justify-between p-5">
            <div>
              <Badge variant="info" className="mb-2">
                Interactive Card
              </Badge>
              <h3 className="text-base font-bold">Tap/Click Feedback</h3>
              <p className="text-muted-foreground mt-1 text-xs">
                Optimized for touch interaction with active elevation scale.
              </p>
            </div>
            <div className="text-primary mt-4 flex items-center text-xs font-semibold">
              <span>View details</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </div>
          </InteractiveCard>
        </div>
      </section>

      {/* 4. Dialogs, Bottom Sheets & Drawers */}
      <section className="space-y-4">
        <h2 className="text-foreground text-xl font-bold tracking-tight">
          4. Dialogs, Bottom Sheets & Drawers
        </h2>
        <div className="border-border bg-card flex flex-wrap items-center gap-4 rounded-2xl border p-6">
          {/* Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Modal Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Transaction</DialogTitle>
                <DialogDescription>
                  Are you sure you want to add $45.00 for 30L petrol?
                </DialogDescription>
              </DialogHeader>
              <div className="py-2">
                <MaterialInput label="Notes" placeholder="Optional notes..." />
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save Expense</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Bottom Sheet */}
          <BottomSheet>
            <BottomSheetTrigger asChild>
              <Button variant="secondary">Open Mobile Bottom Sheet</Button>
            </BottomSheetTrigger>
            <BottomSheetContent>
              <BottomSheetHeader>
                <BottomSheetTitle>Quick Expense Entry</BottomSheetTitle>
                <BottomSheetDescription>
                  Mobile-optimized bottom sheet with swipe-down handle bar.
                </BottomSheetDescription>
              </BottomSheetHeader>
              <div className="space-y-4 py-4">
                <MaterialInput label="Odometer Reading (km)" defaultValue="124500" />
                <MaterialInput label="Total Cost ($)" defaultValue="52.00" />
                <Button className="w-full">Submit Fuel Entry</Button>
              </div>
            </BottomSheetContent>
          </BottomSheet>

          {/* Drawer */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost">Open Side Drawer</Button>
            </DrawerTrigger>
            <DrawerContent side="right">
              <DrawerHeader>
                <DrawerTitle>Quick Settings Drawer</DrawerTitle>
              </DrawerHeader>
              <div className="space-y-4 py-4">
                <p className="text-muted-foreground text-xs">
                  Slide-over panel configuration menu with touch backdrop overlay.
                </p>
                <MaterialInput label="Service Center" defaultValue="Official Service" />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </section>

      {/* 5. Tabs & Dropdowns */}
      <section className="space-y-4">
        <h2 className="text-foreground text-xl font-bold tracking-tight">
          5. Tabs & Dropdowns / Selects
        </h2>
        <div className="border-border bg-card space-y-6 rounded-2xl border p-6">
          <Tabs defaultValue="vehicles">
            <TabsList>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              <TabsTrigger value="fuel">Fuel Logs</TabsTrigger>
              <TabsTrigger value="service">Service History</TabsTrigger>
            </TabsList>
            <TabsContent
              value="vehicles"
              className="text-muted-foreground mt-2 rounded-xl border p-4 text-sm"
            >
              Vehicles tab content panel.
            </TabsContent>
            <TabsContent
              value="fuel"
              className="text-muted-foreground mt-2 rounded-xl border p-4 text-sm"
            >
              Fuel logs tab content panel.
            </TabsContent>
            <TabsContent
              value="service"
              className="text-muted-foreground mt-2 rounded-xl border p-4 text-sm"
            >
              Service history tab content panel.
            </TabsContent>
          </Tabs>

          <div className="border-border grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">
                Select Dropdown
              </label>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petrol">Petrol (95 Octane)</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric (EV)</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">
                Action Menu Dropdown
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Actions Menu</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Vehicle Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log Fuel Entry</DropdownMenuItem>
                  <DropdownMenuItem>Log Maintenance</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete Record</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Badges & Toast Notifications */}
      <section className="space-y-4">
        <h2 className="text-foreground text-xl font-bold tracking-tight">6. Badges & Toasts</h2>
        <div className="border-border bg-card space-y-6 rounded-2xl border p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">
              <CheckCircle className="h-3 w-3" />
              Synced
            </Badge>
            <Badge variant="warning">
              <AlertTriangle className="h-3 w-3" />
              Pending
            </Badge>
            <Badge variant="info">
              <Info className="h-3 w-3" />
              Offline
            </Badge>
            <Badge variant="destructive">Failed</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>

          <div className="border-border flex flex-wrap gap-3 border-t pt-4">
            <Button
              size="sm"
              onClick={() =>
                toast({
                  title: "Fuel Record Added",
                  description: "Saved locally to IndexedDB",
                  variant: "success",
                })
              }
            >
              Trigger Success Toast
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() =>
                toast({
                  title: "Sync Failed",
                  description: "Network connection lost",
                  variant: "error",
                })
              }
            >
              Trigger Error Toast
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                toast({
                  title: "Working Offline",
                  description: "Changes will sync when reconnected",
                  variant: "warning",
                })
              }
            >
              Trigger Warning Toast
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Loading Skeletons */}
      <section className="space-y-4">
        <h2 className="text-foreground text-xl font-bold tracking-tight">7. Loading Skeletons</h2>
        <SkeletonList rows={2} />
      </section>

      {/* 8. Empty States & Error States */}
      <section className="space-y-4">
        <h2 className="text-foreground text-xl font-bold tracking-tight">
          8. Empty States & Error States
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <EmptyState
            title="No Fuel Logs Found"
            description="You haven't recorded any fuel receipts yet. Start by logging your first refueling."
            primaryAction={{
              label: "Add Fuel Entry",
              onClick: () => {},
              icon: <Plus className="h-4 w-4" />,
            }}
          />
          <ErrorState
            title="Unable to Load Data"
            message="Failed to load maintenance records from server."
            error="HTTP 500: Internal Database Timeout"
            onRetry={() => {}}
          />
        </div>
      </section>
    </div>
  );
}
