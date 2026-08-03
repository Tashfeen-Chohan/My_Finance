"use client";

import React, { useState } from "react";
import { useVehicles } from "@/hooks/use-vehicles-query";
import {
  useFuelExpenses,
  useAddFuelExpense,
  useUpdateFuelExpense,
  useDeleteFuelExpense,
} from "@/hooks/use-fuel-query";
import { FuelHeader } from "@/components/fuel/fuel-header";
import { FuelStatCards } from "@/components/fuel/fuel-stat-cards";
import { FuelMonthlyChart } from "@/components/fuel/fuel-monthly-chart";
import { FuelFilters } from "@/components/fuel/fuel-filters";
import { FuelLogsList } from "@/components/fuel/fuel-logs-list";
import { FuelDialog } from "@/components/fuel/fuel-dialog";
import { ViewFuelDialog } from "@/components/fuel/view-fuel-dialog";
import { DeleteFuelDialog } from "@/components/fuel/delete-fuel-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function FuelPage() {
  const [timeRangeFilter, setTimeRangeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: vehicles = [], isLoading: isVehiclesLoading } = useVehicles();
  const { data: fuelExpenses = [], isLoading: isExpensesLoading } = useFuelExpenses(null);

  const isLoading = isExpensesLoading || isVehiclesLoading;

  const addFuelMutation = useAddFuelExpense();
  const updateFuelMutation = useUpdateFuelExpense();
  const deleteFuelMutation = useDeleteFuelExpense();

  const { toast } = useToast();

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [expenseToView, setExpenseToView] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const handleOpenViewModal = (expense) => {
    setExpenseToView(expense);
    setIsViewDialogOpen(true);
  };

  const handleOpenAddModal = () => {
    setExpenseToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setExpenseToEdit(expense);
    setIsDialogOpen(true);
  };

  const handleOpenDeleteModal = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitExpense = async (formData) => {
    try {
      if (expenseToEdit) {
        const id = expenseToEdit.id || expenseToEdit._id;
        await updateFuelMutation.mutateAsync({ id, data: formData });
        toast({ title: "Refill Updated", description: "Fuel refill log updated successfully", variant: "success" });
      } else {
        await addFuelMutation.mutateAsync(formData);
        toast({ title: "Refill Logged", description: "New fuel refill recorded", variant: "success" });
      }
    } catch (err) {
      toast({
        title: "Action Failed",
        description: err instanceof Error ? err.message : "Fuel log operation failed",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      await deleteFuelMutation.mutateAsync(id);
      toast({ title: "Refill Deleted", description: "Fuel log entry removed", variant: "success" });
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err instanceof Error ? err.message : "Could not delete fuel entry",
        variant: "destructive",
      });
    }
  };

  // Filter fuel expenses
  const filteredExpenses = fuelExpenses.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.stationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (timeRangeFilter === "this_month") {
      const now = new Date();
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    } else if (timeRangeFilter === "last_90_days") {
      const now = new Date();
      const past90 = new Date(now.setDate(now.getDate() - 90));
      return new Date(item.date) >= past90;
    }

    return true;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8 pb-12">
      {/* Header Banner */}
      <FuelHeader onLogFuelRefill={handleOpenAddModal} />

      {/* KPI Stat Cards */}
      <FuelStatCards fuelExpenses={filteredExpenses} isLoading={isLoading} />

      {/* Monthly Expenditure Chart */}
      <FuelMonthlyChart fuelExpenses={filteredExpenses} isLoading={isLoading} />

      {/* Filter and Search Bar */}
      <FuelFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        timeRangeFilter={timeRangeFilter}
        onTimeRangeChange={setTimeRangeFilter}
      />

      {/* Refill Logs History */}
      <FuelLogsList
        expenses={filteredExpenses}
        vehicles={vehicles}
        isLoading={isLoading}
        onView={handleOpenViewModal}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        onLogFuelRefill={handleOpenAddModal}
      />

      {/* Modals */}
      <ViewFuelDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        expense={expenseToView}
        vehicles={vehicles}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      <FuelDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        expenseToEdit={expenseToEdit}
        vehicles={vehicles}
        onSubmit={handleSubmitExpense}
      />

      <DeleteFuelDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        expenseToDelete={expenseToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
