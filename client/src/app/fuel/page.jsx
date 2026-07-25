import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Fuel, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FuelPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fuel Log</h1>
          <p className="text-muted-foreground text-sm">
            Track fuel expenses, consumption, and efficiency metrics.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Log Fuel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Fuel className="text-primary h-5 w-5" />
            <CardTitle>Fuel Expense Architecture</CardTitle>
          </div>
          <CardDescription>
            React Hook Form + Zod validation ready for fuel entry inputs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
            No fuel logs recorded yet. Form schema scaffolded in{" "}
            <code className="text-primary font-mono">@/features/fuel/schemas</code>.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
