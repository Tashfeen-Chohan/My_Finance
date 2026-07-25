import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Wrench, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance Records</h1>
          <p className="text-muted-foreground text-sm">
            Log vehicle servicing, repairs, parts, and oil changes.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Log Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wrench className="text-primary h-5 w-5" />
            <CardTitle>Maintenance Module Architecture</CardTitle>
          </div>
          <CardDescription>
            Configured for Cloudinary receipt uploads and offline syncing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
            No maintenance records added yet. Ready for feature logic in{" "}
            <code className="text-primary font-mono">@/features/maintenance</code>.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
