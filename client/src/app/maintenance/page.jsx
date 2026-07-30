"use client";

import React, { useState } from "react";
import { useVehicles } from "@/hooks/use-vehicles-query";
import {
  useMaintenanceLogs,
  useUpcomingServices,
  useAddMaintenance,
  useUpdateMaintenance,
  useDeleteMaintenance,
} from "@/hooks/use-maintenance-query";
import { MaintenanceHeader } from "@/components/maintenance/maintenance-header";
import { MaintenanceStatCards } from "@/components/maintenance/maintenance-stat-cards";
import { MaintenanceRemindersCard } from "@/components/maintenance/maintenance-reminders-card";
import { MaintenanceFilters } from "@/components/maintenance/maintenance-filters";
import { MaintenanceLogsList } from "@/components/maintenance/maintenance-logs-list";
import { MaintenanceDialog } from "@/components/maintenance/maintenance-dialog";
import { DeleteMaintenanceDialog } from "@/components/maintenance/delete-maintenance-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function MaintenancePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: vehicles = [] } = useVehicles();
  const { data: maintenanceLogs = [], isLoading } = useMaintenanceLogs(null);
  const { data: upcomingServices = [] } = useUpcomingServices();

  const addMaintenanceMutation = useAddMaintenance();
  const updateMaintenanceMutation = useUpdateMaintenance();
  const deleteMaintenanceMutation = useDeleteMaintenance();

  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [maintenanceToEdit, setMaintenanceToEdit] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState(null);

  const handleOpenAddModal = () => {
    setMaintenanceToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setMaintenanceToEdit(item);
    setIsDialogOpen(true);
  };

  const handleOpenDeleteModal = (item) => {
    setMaintenanceToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitMaintenance = async (formData) => {
    try {
      if (maintenanceToEdit) {
        const id = maintenanceToEdit.id || maintenanceToEdit._id;
        await updateMaintenanceMutation.mutateAsync({ id, data: formData });
        toast({ title: "Record Updated", description: "Maintenance log updated successfully", variant: "success" });
      } else {
        await addMaintenanceMutation.mutateAsync(formData);
        toast({ title: "Maintenance Logged", description: "New vehicle service logged", variant: "success" });
      }
    } catch (err) {
      toast({
        title: "Action Failed",
        description: err instanceof Error ? err.message : "Maintenance log operation failed",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      await deleteMaintenanceMutation.mutateAsync(id);
      toast({ title: "Record Deleted", description: "Maintenance entry removed", variant: "success" });
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err instanceof Error ? err.message : "Could not delete maintenance entry",
        variant: "destructive",
      });
    }
  };

  // Filter maintenance records
  const filteredLogs = maintenanceLogs.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serviceProvider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8 pb-12">
      {/* Header Banner */}
      <MaintenanceHeader onLogMaintenance={handleOpenAddModal} />

      {/* Summary KPI Cards */}
      <MaintenanceStatCards maintenanceLogs={filteredLogs} upcomingServices={upcomingServices} />

      {/* Upcoming Reminders Card */}
      <MaintenanceRemindersCard upcomingServices={upcomingServices} vehicles={vehicles} />

      {/* Filter and Search Bar */}
      <MaintenanceFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Maintenance Logs History */}
      <MaintenanceLogsList
        logs={filteredLogs}
        vehicles={vehicles}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        onLogMaintenance={handleOpenAddModal}
      />

      {/* Modals */}
      <MaintenanceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        maintenanceToEdit={maintenanceToEdit}
        vehicles={vehicles}
        onSubmit={handleSubmitMaintenance}
      />

      <DeleteMaintenanceDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        maintenanceToDelete={maintenanceToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
