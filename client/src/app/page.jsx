import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Server,
  Database,
  ShieldCheck,
  Zap,
  Layers,
  CheckCircle2,
  Package,
} from "lucide-react";

export default function DashboardPage() {
  const techStack = [
    { name: "Next.js App Router", category: "Framework", status: "Active", icon: Server },
    {
      name: "TypeScript & Absolute Imports",
      category: "Language",
      status: "Strict",
      icon: ShieldCheck,
    },
    { name: "Tailwind CSS & shadcn/ui", category: "Styling", status: "Ready", icon: Layers },
    { name: "TanStack Query v5", category: "Data Fetching", status: "Configured", icon: Zap },
    {
      name: "Zustand & Direct REST API",
      category: "State & Storage",
      status: "Configured",
      icon: Database,
    },
    { name: "React Hook Form & Zod", category: "Validation", status: "Ready", icon: CheckCircle2 },
    {
      name: "PWA Support & Workbox",
      category: "Offline Capabilities",
      status: "Enabled",
      icon: Smartphone,
    },
    {
      name: "ESLint, Prettier, Husky",
      category: "Tooling & CI",
      status: "Configured",
      icon: Package,
    },
  ];

  const modules = [
    { name: "Authentication", phase: "Phase 1", status: "Scaffolded" },
    { name: "Dashboard & Navigation", phase: "Phase 1", status: "Active" },
    { name: "Vehicle Expenses", phase: "Phase 1", status: "Scaffolded" },
    { name: "Fuel Tracking", phase: "Phase 1", status: "Scaffolded" },
    { name: "Maintenance Logs", phase: "Phase 1", status: "Scaffolded" },
    { name: "Grocery & Budgeting", phase: "Phase 2", status: "Planned" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Overview Card */}
      <div className="from-card via-card to-primary/5 border-border flex flex-col justify-between gap-4 rounded-2xl border bg-gradient-to-br p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="success">Architecture Ready</Badge>
            <Badge variant="outline" className="font-mono text-xs">
              v1.0 Scaffold
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Personal Finance PWA Architecture
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Production-grade Next.js application scaffold using TypeScript, Tailwind CSS, shadcn/ui,
            TanStack Query, Zustand, idb IndexedDB, and PWA capabilities.
          </p>
        </div>
      </div>

      {/* Tech Stack Matrix */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Zap className="text-primary h-5 w-5" />
          Technical Stack & Architecture Verification
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <Card key={tech.name} className="glass-panel">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                  <span className="text-muted-foreground text-xs font-medium">{tech.category}</span>
                  <Icon className="text-primary h-4 w-4" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <h3 className="mb-2 text-sm leading-tight font-semibold">{tech.name}</h3>
                  <Badge variant="secondary" className="text-[10px]">
                    {tech.status}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Module Architecture Roadmap */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Layers className="text-primary h-5 w-5" />
          Application Core Modules & Architecture Status
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {modules.map((mod) => (
            <Card key={mod.name}>
              <CardHeader className="p-5">
                <div className="flex items-center justify-between">
                  <Badge variant={mod.phase === "Phase 1" ? "default" : "outline"}>
                    {mod.phase}
                  </Badge>
                  <span className="text-muted-foreground font-mono text-xs">{mod.status}</span>
                </div>
                <CardTitle className="mt-2 text-base">{mod.name}</CardTitle>
                <CardDescription className="text-xs">
                  Feature directory structure prepared in{" "}
                  <code className="text-primary font-mono">@/features/</code>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
