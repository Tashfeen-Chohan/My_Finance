import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Car, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VehiclesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicles Directory</h1>
          <p className="text-muted-foreground text-sm">
            Manage registered vehicles for fuel and maintenance tracking.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Car className="text-primary h-5 w-5" />
            <CardTitle>Vehicle Module Architecture</CardTitle>
          </div>
          <CardDescription>
            Ready for vehicle CRUD implementation linked with Zustand & IndexedDB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
            No vehicles registered yet. Business logic scaffolded in{" "}
            <code className="text-primary font-mono">@/features/vehicles</code>.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
