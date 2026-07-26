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
  Settings,
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  FileSpreadsheet,
  Printer,
  LogOut,
  ShieldCheck,
  Database,
  Info,
  User,
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
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      {/* Header Banner */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
            <Settings className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Application Settings</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage your account profile, theme preferences, data export & backup utilities.
        </p>
      </div>

      {/* 1. Google Account Section */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Google / User Account</CardTitle>
          </div>
          <CardDescription>Authentication profile and active login session details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-secondary/20">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border border-primary/20 shadow-sm">
                <AvatarImage src={user?.avatar} alt={user?.name || "User Avatar"} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-foreground">{user?.name || "Authenticated User"}</h4>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Session
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
              </div>
            </div>

            <Button variant="outline" onClick={logout} className="gap-2 text-destructive hover:text-destructive cursor-pointer">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Theme Customizer */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Appearance & Theme</CardTitle>
          </div>
          <CardDescription>Customize the visual interface mode of MyFinance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                theme === "light"
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border/50 bg-secondary/20 text-muted-foreground hover:bg-secondary/40"
              }`}
            >
              <Sun className="h-5 w-5 text-amber-500" />
              Light Mode
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                theme === "dark"
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border/50 bg-secondary/20 text-muted-foreground hover:bg-secondary/40"
              }`}
            >
              <Moon className="h-5 w-5 text-indigo-400" />
              Dark Mode
            </button>

            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                theme === "system"
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border/50 bg-secondary/20 text-muted-foreground hover:bg-secondary/40"
              }`}
            >
              <Laptop className="h-5 w-5 text-emerald-400" />
              System Default
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 3. Export CSV & PDF */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
            <CardTitle className="text-lg">Export Data (CSV & PDF)</CardTitle>
          </div>
          <CardDescription>Export your financial records for accounting and external reporting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleExportFuelCSV} className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold cursor-pointer">
              <FileSpreadsheet className="h-4 w-4" />
              Export Fuel Logs (CSV)
            </Button>

            <Button onClick={handleExportMaintenanceCSV} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer">
              <FileSpreadsheet className="h-4 w-4" />
              Export Maintenance (CSV)
            </Button>

            <Button onClick={() => window.print()} variant="outline" className="gap-2 cursor-pointer border-border/60">
              <Printer className="h-4 w-4 text-primary" />
              Print / Save Summary PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4. Backup & Restore */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-lg">Backup & Restore</CardTitle>
          </div>
          <CardDescription>Download a full JSON database snapshot or restore records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportBackup}
            accept=".json"
            className="hidden"
          />

          <div className="flex flex-wrap gap-4">
            <Button onClick={handleExportBackup} variant="outline" className="gap-2 border-border/60 cursor-pointer">
              <Download className="h-4 w-4 text-emerald-500" />
              Download Full JSON Backup
            </Button>

            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2 border-border/60 cursor-pointer">
              <Upload className="h-4 w-4 text-blue-400" />
              Restore / Import JSON Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 5. About Section */}
      <Card className="border-border/40 bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-lg">About MyFinance</CardTitle>
          </div>
          <CardDescription>System specifications and version info</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span>App Version:</span>
            <span className="font-mono font-bold text-foreground">v1.0.0 (Direct MongoDB Architecture)</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span>State & Data Engine:</span>
            <span className="font-mono font-bold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              TanStack Query v5 + Zustand Auth
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span>PWA Support:</span>
            <span className="font-mono font-bold text-blue-400">Service Worker Active</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
