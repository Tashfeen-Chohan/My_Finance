"use client";

import React, { useState } from "react";
import {
  useVehicles,
  useAddVehicle,
  useUpdateVehicle,
  useSetDefaultVehicle,
  useDeleteVehicle,
} from "@/hooks/use-vehicles-query";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { VehicleDialog } from "@/components/vehicles/vehicle-dialog";
import { DeleteVehicleDialog } from "@/components/vehicles/delete-vehicle-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Plus, Search, Star, Fuel, Gauge, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function VehiclesPage() {
  const { data: vehicles = [], isLoading } = useVehicles();
  const addVehicleMutation = useAddVehicle();
  const updateVehicleMutation = useUpdateVehicle();
  const setDefaultVehicleMutation = useSetDefaultVehicle();
  const deleteVehicleMutation = useDeleteVehicle();

  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [fuelFilter, setFuelFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const handleOpenAddModal = () => {
    setVehicleToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = (vehicle) => {
    setVehicleToEdit(vehicle);
    setIsDialogOpen(true);
  };

  const handleOpenDeleteModal = (vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitVehicle = async (formData) => {
    try {
      if (vehicleToEdit) {
        const id = vehicleToEdit.id || vehicleToEdit._id;
        await updateVehicleMutation.mutateAsync({ id, data: formData });
        toast({ title: "Vehicle Updated", description: "Vehicle details updated successfully", variant: "success" });
      } else {
        await addVehicleMutation.mutateAsync(formData);
        toast({ title: "Vehicle Added", description: "New vehicle registered successfully", variant: "success" });
      }
    } catch (err) {
      toast({
        title: "Action Failed",
        description: err instanceof Error ? err.message : "Vehicle operation failed",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      await deleteVehicleMutation.mutateAsync(id);
      toast({ title: "Vehicle Deleted", description: "Vehicle removed successfully", variant: "success" });
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err instanceof Error ? err.message : "Could not delete vehicle",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultVehicleMutation.mutateAsync(id);
      toast({ title: "Default Updated", description: "Primary default vehicle updated", variant: "success" });
    } catch (err) {
      toast({
        title: "Update Failed",
        description: err instanceof Error ? err.message : "Could not set default vehicle",
        variant: "destructive",
      });
    }
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFuel = fuelFilter === "all" || v.fuelType === fuelFilter;

    return matchesSearch && matchesFuel;
  });

  const defaultVehicle = vehicles.find((v) => v.isDefault) || vehicles[0];

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      {/* Hero / Header Section */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Car className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Vehicles Garage</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage your registered vehicles, track odometer readings, and configure default preferences.
          </p>
        </div>

        <Button onClick={handleOpenAddModal} size="lg" className="gap-2 shadow-lg shadow-primary/20 cursor-pointer">
          <Plus className="h-5 w-5" />
          Add New Vehicle
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Registered</p>
              <h3 className="text-2xl font-bold text-foreground">{vehicles.length} Vehicles</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Star className="h-6 w-6 fill-amber-500/20" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Primary Vehicle</p>
              <h3 className="text-lg font-bold text-foreground truncate">
                {defaultVehicle ? defaultVehicle.name : "None Selected"}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Gauge className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Combined Distance</p>
              <h3 className="text-2xl font-bold text-foreground">
                {vehicles.reduce((acc, v) => acc + (v.currentOdometer || 0), 0).toLocaleString()} km
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/40 bg-card/40 p-4 backdrop-blur-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search make, model, license plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 border-border/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Fuel className="h-4 w-4" />
            Fuel:
          </div>
          <Select value={fuelFilter} onValueChange={setFuelFilter}>
            <SelectTrigger className="w-40 bg-background/50 border-border/50">
              <SelectValue placeholder="Fuel Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fuel Types</SelectItem>
              <SelectItem value="petrol">Petrol</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Electric (EV)</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="cng">CNG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading vehicle garage data...</p>
        </div>
      ) : filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id || vehicle._id}
              vehicle={vehicle}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-border/60 bg-card/20 p-12 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">No Vehicles Found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1 mb-6">
            {searchQuery || fuelFilter !== "all"
              ? "No vehicles matched your filter criteria. Try clearing search filters."
              : "Your garage is currently empty. Register your first vehicle to start tracking fuel logs and maintenance history."}
          </p>
          <Button onClick={handleOpenAddModal} className="gap-2">
            <Plus className="h-4 w-4" />
            Add First Vehicle
          </Button>
        </Card>
      )}

      {/* Modals */}
      <VehicleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        vehicleToEdit={vehicleToEdit}
        onSubmit={handleSubmitVehicle}
      />

      <DeleteVehicleDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        vehicleToDelete={vehicleToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
