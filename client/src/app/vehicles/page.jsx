"use client";

import React, { useState } from "react";
import {
  useVehicles,
  useAddVehicle,
  useUpdateVehicle,
  useSetDefaultVehicle,
  useDeleteVehicle,
} from "@/hooks/use-vehicles-query";
import { VehicleHeader } from "@/components/vehicles/vehicle-header";
import { VehicleStatCards } from "@/components/vehicles/vehicle-stat-cards";
import { VehicleFilters } from "@/components/vehicles/vehicle-filters";
import { VehicleGrid } from "@/components/vehicles/vehicle-grid";
import { VehicleDialog } from "@/components/vehicles/vehicle-dialog";
import { DeleteVehicleDialog } from "@/components/vehicles/delete-vehicle-dialog";
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

  const hasFilters = Boolean(searchQuery || fuelFilter !== "all");

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      {/* Hero / Header Section */}
      <VehicleHeader onAddVehicle={handleOpenAddModal} />

      {/* Summary KPI Cards */}
      <VehicleStatCards vehicles={vehicles} />

      {/* Filter and Search Bar */}
      <VehicleFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        fuelFilter={fuelFilter}
        onFuelFilterChange={setFuelFilter}
      />

      {/* Vehicle Grid & Empty / Loading States */}
      <VehicleGrid
        vehicles={filteredVehicles}
        isLoading={isLoading}
        hasFilters={hasFilters}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        onSetDefault={handleSetDefault}
        onAddVehicle={handleOpenAddModal}
      />

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
