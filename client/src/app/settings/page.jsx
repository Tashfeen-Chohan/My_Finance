import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Database, Smartphone } from "lucide-react";
import { ThemeToggle } from "@/components/common/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Preferences, storage connection, theme configuration, and account details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="text-primary h-5 w-5" />
              <CardTitle>Appearance & Theme</CardTitle>
            </div>
            <CardDescription>
              Toggle light mode, dark mode, or system theme preference.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme Mode</span>
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="text-primary h-5 w-5" />
              <CardTitle>Cloud Database Connection</CardTitle>
            </div>
            <CardDescription>Direct MongoDB Database storage & REST API connection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">MongoDB Database:</span>
              <span className="font-semibold text-emerald-500">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PWA Service Worker:</span>
              <span className="font-semibold text-emerald-500">Registered</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
