"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wrench, Plus, MoreVertical, Edit2, Trash2, Gauge, Calendar, Droplet, Sparkles, Loader2, Store } from "lucide-react";
import { CATEGORY_BADGES, CATEGORY_LABELS } from "@/constants/maintenance";

export function MaintenanceLogsList({
  logs = [],
  vehicles = [],
  isLoading = false,
  onEdit,
  onDelete,
  onLogMaintenance,
}) {
  const getVehicleName = (vehicleId) => {
    const vId = vehicleId?._id || vehicleId;
    const v = vehicles.find((item) => (item.id || item._id) === vId);
    return v ? v.name : "Vehicle";
  };

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-lg">Maintenance Logs History</CardTitle>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {logs.length} Logs
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
        ) : logs.length > 0 ? (
          <div className="divide-y divide-border/40">
            {logs.map((item) => {
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
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${CATEGORY_BADGES[item.category] || CATEGORY_BADGES.other}`}>
                      {isOilChange ? <Droplet className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-foreground">{item.title}</h4>
                        <Badge className={`capitalize text-[11px] font-medium border ${CATEGORY_BADGES[item.category] || CATEGORY_BADGES.other}`}>
                          {CATEGORY_LABELS[item.category] || item.category}
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

                  {/* Right: Cost & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        PKR {Number(item.cost ?? item.totalCost ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 backdrop-blur-xl">
                        <DropdownMenuItem onClick={() => onEdit(item)} className="cursor-pointer">
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit Record
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(item)}
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
            <Button onClick={onLogMaintenance} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer">
              <Plus className="h-4 w-4" />
              Log First Maintenance
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
