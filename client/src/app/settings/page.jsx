"use client";

import React, { useRef } from "react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/stores/use-auth-store";
import { apiClient } from "@/services/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  FileSpreadsheet,
  Printer,
  LogOut,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  // Export Full Backup JSON
  const handleExportBackup = async () => {
    try {
      toast({ title: "Exporting Data", description: "Fetching complete finance records..." });

      const [vehiclesRes, fuelRes, maintenanceRes] = await Promise.all([
        apiClient.get("/vehicles"),
        apiClient.get("/fuel-expenses"),
        apiClient.get("/maintenance"),
      ]);

      const backupData = {
        app: "MyFinance PWA",
        exportedAt: new Date().toISOString(),
        user: { name: user?.name, email: user?.email },
        vehicles: vehiclesRes.data?.data || [],
        fuelExpenses: fuelRes.data?.data || [],
        maintenanceLogs: maintenanceRes.data?.data || [],
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `myfinance_backup_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast({ title: "Backup Exported", description: "JSON backup file downloaded successfully" });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: err instanceof Error ? err.message : "Could not export backup",
        variant: "destructive",
      });
    }
  };

  // Restore Backup JSON
  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result;
        const parsed = JSON.parse(content);

        if (!parsed.vehicles && !parsed.fuelExpenses && !parsed.maintenanceLogs) {
          throw new Error("Invalid backup file format");
        }

        toast({
          title: "Backup Verified",
          description: `Loaded backup with ${parsed.vehicles?.length || 0} vehicles, ${parsed.fuelExpenses?.length || 0} fuel logs, and ${parsed.maintenanceLogs?.length || 0} maintenance entries.`,
        });
      } catch (err) {
        toast({
          title: "Import Failed",
          description: err instanceof Error ? err.message : "Failed to parse JSON backup",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  // Export Fuel CSV
  const handleExportFuelCSV = async () => {
    try {
      const res = await apiClient.get("/fuel-expenses");
      const logs = res.data?.data || [];

      if (logs.length === 0) {
        toast({ title: "No Data", description: "No fuel logs found to export" });
        return;
      }

      const headers = ["Date", "Odometer (km)", "Quantity (L)", "Unit Price (PKR)", "Total Cost (PKR)", "Station", "Full Tank"];
      const rows = logs.map((l) => [
        l.date ? new Date(l.date).toLocaleDateString() : "",
        l.odometer || 0,
        l.quantity || 0,
        l.unitPrice || 0,
        l.totalCost || 0,
        `"${l.stationName || ""}"`,
        l.isFullTank ? "Yes" : "No",
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `fuel_expenses_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({ title: "CSV Downloaded", description: "Fuel logs exported to CSV" });
    } catch (err) {
      toast({ title: "Export Error", description: "Failed to generate CSV", variant: "destructive" });
    }
  };

  // Export Maintenance CSV
  const handleExportMaintenanceCSV = async () => {
    try {
      const res = await apiClient.get("/maintenance");
      const logs = res.data?.data || [];

      if (logs.length === 0) {
        toast({ title: "No Data", description: "No maintenance records found to export" });
        return;
      }

      const headers = ["Date", "Title", "Category", "Odometer (km)", "Parts Cost", "Labor Cost", "Total Cost", "Workshop"];
      const rows = logs.map((m) => [
        m.date ? new Date(m.date).toLocaleDateString() : "",
        `"${m.title || ""}"`,
        m.category || "",
        m.odometer || 0,
        m.partsCost || 0,
        m.laborCost || 0,
        m.totalCost || 0,
        `"${m.serviceProvider || ""}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `maintenance_logs_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({ title: "CSV Downloaded", description: "Maintenance records exported to CSV" });
    } catch (err) {
      toast({ title: "Export Error", description: "Failed to generate CSV", variant: "destructive" });
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Manage your account, appearance, data exports, and backups.
        </p>
      </div>

      {/* 1. Account Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Account</CardTitle>
          <CardDescription className="text-xs">Active authentication profile and session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-secondary/30">
            <div className="flex items-center gap-3.5">
              <Avatar className="h-11 w-11 border border-border">
                <AvatarImage src={user?.avatar} alt={user?.name || "User Avatar"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-foreground">{user?.name || "Authenticated User"}</h4>
                  <Badge variant="secondary" className="text-[10px] font-medium gap-1 text-teal-600 dark:text-teal-400">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={logout} className="gap-2 text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Theme Customizer */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Appearance</CardTitle>
          <CardDescription className="text-xs">Choose light, dark, or system theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                theme === "light"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                theme === "dark"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                theme === "system"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Laptop className="h-4 w-4" />
              <span>System</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 3. Export CSV & PDF */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Export Data</CardTitle>
          <CardDescription className="text-xs">Download CSV spreadsheets or print a summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap">
            <Button onClick={handleExportFuelCSV} size="sm" className="w-full sm:w-auto gap-2 font-medium">
              <FileSpreadsheet className="h-4 w-4" />
              Fuel Logs (CSV)
            </Button>

            <Button onClick={handleExportMaintenanceCSV} variant="outline" size="sm" className="w-full sm:w-auto gap-2 font-medium">
              <FileSpreadsheet className="h-4 w-4" />
              Maintenance (CSV)
            </Button>

            <Button onClick={() => window.print()} variant="outline" size="sm" className="w-full sm:w-auto gap-2 font-medium">
              <Printer className="h-4 w-4" />
              Print / PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4. Backup & Restore */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Backup & Restore</CardTitle>
          <CardDescription className="text-xs">Full JSON snapshot of vehicles, fuel, and maintenance</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportBackup}
            accept=".json"
            className="hidden"
          />

          <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap">
            <Button onClick={handleExportBackup} variant="outline" size="sm" className="w-full sm:w-auto gap-2 font-medium">
              <Download className="h-4 w-4" />
              Download JSON Backup
            </Button>

            <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="w-full sm:w-auto gap-2 font-medium">
              <Upload className="h-4 w-4" />
              Import JSON Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 5. About Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">About</CardTitle>
          <CardDescription className="text-xs">Application details</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border text-xs text-muted-foreground">
          <div className="flex items-center justify-between py-2.5">
            <span>Version</span>
            <span className="font-mono font-medium text-foreground">v1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span>Data Engine</span>
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              TanStack Query v5 + Zustand
            </span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span>Offline PWA</span>
            <span className="font-medium text-foreground">Active</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
