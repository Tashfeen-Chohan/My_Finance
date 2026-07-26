"use client";

import React, { useState } from "react";
import { useVehicles } from "@/hooks/use-vehicles-query";
import {
  useFuelExpenses,
  useAddFuelExpense,
  useUpdateFuelExpense,
  useDeleteFuelExpense,
} from "@/hooks/use-fuel-query";
import { FuelStatCards } from "@/components/fuel/fuel-stat-cards";
import { FuelMonthlyChart } from "@/components/fuel/fuel-monthly-chart";
import { FuelDialog } from "@/components/fuel/fuel-dialog";
import { DeleteFuelDialog } from "@/components/fuel/delete-fuel-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Fuel, Plus, Search, MoreVertical, Edit2, Trash2, Gauge, Calendar, MapPin, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function FuelPage() {
  const [selectedVehicleId, setSelectedVehicleId] = useState("all");
  const [timeRangeFilter, setTimeRangeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: vehicles = [] } = useVehicles();
  const { data: fuelExpenses = [], isLoading } = useFuelExpenses(selectedVehicleId === "all" ? null : selectedVehicleId);

  const addFuelMutation = useAddFuelExpense();
  const updateFuelMutation = useUpdateFuelExpense();
  const deleteFuelMutation = useDeleteFuelExpense();

  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

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
        toast({ title: "Refill Updated", description: "Fuel refill log updated successfully" });
      } else {
        await addFuelMutation.mutateAsync(formData);
        toast({ title: "Refill Logged", description: "New fuel refill recorded" });
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
      toast({ title: "Refill Deleted", description: "Fuel log entry removed" });
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

  const getVehicleName = (vehicleId) => {
    const v = vehicles.find((item) => (item.id || item._id) === vehicleId);
    return v ? v.name : "Vehicle";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
              <Fuel className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Fuel Expenses & Efficiency</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Track fuel refills, analyze average mileage (km/L), cost per kilometer, and monthly trends.
          </p>
        </div>

        <Button onClick={handleOpenAddModal} size="lg" className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 cursor-pointer">
          <Plus className="h-5 w-5" />
          Log Fuel Refill
        </Button>
      </div>

      {/* KPI Stat Cards */}
      <FuelStatCards fuelExpenses={filteredExpenses} />

      {/* Monthly Expenditure Chart */}
      <FuelMonthlyChart fuelExpenses={filteredExpenses} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/40 bg-card/40 p-4 backdrop-blur-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search gas station or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 border-border/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Vehicle Selector Filter */}
          <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
            <SelectTrigger className="w-48 bg-background/50 border-border/50">
              <SelectValue placeholder="All Vehicles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              {vehicles.map((v) => (
                <SelectItem key={v.id || v._id} value={v.id || v._id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Time Range Filter */}
          <Select value={timeRangeFilter} onValueChange={setTimeRangeFilter}>
            <SelectTrigger className="w-44 bg-background/50 border-border/50">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_90_days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Monthly Refill History List */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg">Refill Logs History</CardTitle>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {filteredExpenses.length} Records
            </Badge>
          </div>
          <CardDescription>Detailed history of fuel refills sorted chronologically</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              <p className="text-sm font-medium text-muted-foreground">Loading fuel log data...</p>
            </div>
          ) : filteredExpenses.length > 0 ? (
            <div className="divide-y divide-border/40">
              {filteredExpenses.map((expense) => {
                const dateStr = expense.date ? new Date(expense.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }) : "N/A";

                return (
                  <div
                    key={expense.id || expense._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-secondary/30 transition-colors"
                  >
                    {/* Left: Refill details */}
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <Fuel className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-foreground">{getVehicleName(expense.vehicleId)}</h4>
                          {expense.isFullTank && (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[11px] font-medium gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Full Tank
                            </Badge>
                          )}
                          {expense.computedEconomy && (
                            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[11px] font-medium">
                              {expense.computedEconomy} km/L
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {dateStr}
                          </span>
                          <span className="flex items-center gap-1">
                            <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
                            {expense.odometer?.toLocaleString()} km
                          </span>
                          {expense.stationName && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                              {expense.stationName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quantity, Price & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          PKR {Number(expense.totalCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {expense.quantity} L @ PKR {expense.unitPrice}/L
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 backdrop-blur-xl">
                          <DropdownMenuItem onClick={() => handleOpenEditModal(expense)} className="cursor-pointer">
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Refill Log
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleOpenDeleteModal(expense)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Entry
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No Fuel Refills Logged</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1 mb-6">
                Start tracking your fuel expenses to unlock monthly mileage trends and cost per kilometer analytics.
              </p>
              <Button onClick={handleOpenAddModal} className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold cursor-pointer">
                <Plus className="h-4 w-4" />
                Log First Fuel Refill
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
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
