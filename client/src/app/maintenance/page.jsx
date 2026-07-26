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
import { MaintenanceStatCards } from "@/components/maintenance/maintenance-stat-cards";
import { MaintenanceRemindersCard } from "@/components/maintenance/maintenance-reminders-card";
import { MaintenanceDialog } from "@/components/maintenance/maintenance-dialog";
import { DeleteMaintenanceDialog } from "@/components/maintenance/delete-maintenance-dialog";
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
import { Wrench, Plus, Search, MoreVertical, Edit2, Trash2, Gauge, Calendar, Droplet, Sparkles, Loader2, Store } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const categoryBadges = {
  oil_change: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  service: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  repair: "bg-red-500/10 text-red-400 border-red-500/20",
  part_replacement: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  tire: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  washing: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  inspection: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  other: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const categoryLabels = {
  oil_change: "Oil Change",
  service: "Service",
  repair: "Repair",
  part_replacement: "Part Replacement",
  tire: "Tire Job",
  washing: "Wash & Detailing",
  inspection: "Inspection",
  other: "Other",
};

export default function MaintenancePage() {
  const [selectedVehicleId, setSelectedVehicleId] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: vehicles = [] } = useVehicles();
  const { data: maintenanceLogs = [], isLoading } = useMaintenanceLogs(selectedVehicleId === "all" ? null : selectedVehicleId);
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
        toast({ title: "Record Updated", description: "Maintenance log updated successfully" });
      } else {
        await addMaintenanceMutation.mutateAsync(formData);
        toast({ title: "Maintenance Logged", description: "New vehicle service logged" });
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
      toast({ title: "Record Deleted", description: "Maintenance entry removed" });
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

  const getVehicleName = (vehicleId) => {
    const vId = vehicleId?._id || vehicleId;
    const v = vehicles.find((item) => (item.id || item._id) === vId);
    return v ? v.name : "Vehicle";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm">
              <Wrench className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Vehicle Maintenance & Reminders</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Track oil changes, periodic services, workshop repairs, parts replacement, and upcoming reminders.
          </p>
        </div>

        <Button onClick={handleOpenAddModal} size="lg" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20 cursor-pointer">
          <Plus className="h-5 w-5" />
          Log Maintenance
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <MaintenanceStatCards maintenanceLogs={filteredLogs} upcomingServices={upcomingServices} />

      {/* Upcoming Reminders Card */}
      <MaintenanceRemindersCard upcomingServices={upcomingServices} vehicles={vehicles} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/40 bg-card/40 p-4 backdrop-blur-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search service title, workshop or notes..."
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

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-44 bg-background/50 border-border/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="oil_change">Oil Change</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="part_replacement">Part Replacement</SelectItem>
              <SelectItem value="tire">Tire Job</SelectItem>
              <SelectItem value="washing">Wash & Detailing</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Maintenance Logs History */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-lg">Maintenance Logs History</CardTitle>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {filteredLogs.length} Logs
            </Badge>
          </div>
          <CardDescription>Detailed history of oil changes, repairs, and service jobs</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              <p className="text-sm font-medium text-muted-foreground">Loading maintenance data...</p>
            </div>
          ) : filteredLogs.length > 0 ? (
            <div className="divide-y divide-border/40">
              {filteredLogs.map((item) => {
                const dateStr = item.date
                  ? new Date(item.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A";

                const isOilChange = item.category === "oil_change";

                return (
                  <div
                    key={item.id || item._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-secondary/30 transition-colors"
                  >
                    {/* Left: Service Info */}
                    <div className="flex items-start gap-3.5">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${categoryBadges[item.category] || categoryBadges.other}`}>
                        {isOilChange ? <Droplet className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-foreground">{item.title}</h4>
                          <Badge className={`capitalize text-[11px] font-medium border ${categoryBadges[item.category] || categoryBadges.other}`}>
                            {categoryLabels[item.category] || item.category}
                          </Badge>
                          <Badge variant="outline" className="text-[11px] font-mono">
                            {getVehicleName(item.vehicleId)}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {dateStr}
                          </span>
                          <span className="flex items-center gap-1">
                            <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
                            {item.odometer?.toLocaleString()} km
                          </span>
                          {item.serviceProvider && (
                            <span className="flex items-center gap-1">
                              <Store className="h-3.5 w-3.5 text-muted-foreground" />
                              {item.serviceProvider}
                            </span>
                          )}
                        </div>

                        {item.notes && (
                          <p className="text-xs text-muted-foreground/80 italic pt-0.5">
                            &quot;{item.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Cost Breakdown & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          PKR {Number(item.totalCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        {(item.partsCost > 0 || item.laborCost > 0) && (
                          <p className="text-[11px] text-muted-foreground">
                            Parts: PKR {item.partsCost || 0} | Labor: PKR {item.laborCost || 0}
                          </p>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 backdrop-blur-xl">
                          <DropdownMenuItem onClick={() => handleOpenEditModal(item)} className="cursor-pointer">
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleOpenDeleteModal(item)}
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
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-4">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No Maintenance Records Logged</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1 mb-6">
                Start logging your oil changes, repairs, and service history to track vehicle health and expenses.
              </p>
              <Button onClick={handleOpenAddModal} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer">
                <Plus className="h-4 w-4" />
                Log First Maintenance
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
