"use client";

import React from "react";
import { useToast } from "./use-toast";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertOctagon, AlertTriangle, Info, X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-5 right-5 left-5 z-50 flex flex-col gap-3 md:left-auto md:w-96">
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
      ))}
    </div>
  );
}

function ToastCard({ item, onDismiss }) {
  const variant = item.variant === "destructive" ? "error" : item.variant || "default";

  const config = {
    success: {
      icon: CheckCircle2,
      border: "border-emerald-500/50 dark:border-emerald-500/40",
      bg: "bg-emerald-950/20 dark:bg-emerald-950/40 via-card to-card backdrop-blur-xl bg-gradient-to-r from-emerald-500/15",
      accentBar: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]",
      iconBg: "bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 ring-1 ring-emerald-500/40",
      titleColor: "text-emerald-600 dark:text-emerald-400",
      shadow: "shadow-xl shadow-emerald-500/10",
    },
    error: {
      icon: AlertOctagon,
      border: "border-rose-500/50 dark:border-rose-500/40",
      bg: "bg-rose-950/20 dark:bg-rose-950/40 via-card to-card backdrop-blur-xl bg-gradient-to-r from-rose-500/15",
      accentBar: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)]",
      iconBg: "bg-rose-500/20 text-rose-500 dark:text-rose-400 ring-1 ring-rose-500/40",
      titleColor: "text-rose-600 dark:text-rose-400",
      shadow: "shadow-xl shadow-rose-500/15",
    },
    warning: {
      icon: AlertTriangle,
      border: "border-amber-500/50 dark:border-amber-500/40",
      bg: "bg-amber-950/20 dark:bg-amber-950/40 via-card to-card backdrop-blur-xl bg-gradient-to-r from-amber-500/15",
      accentBar: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.7)]",
      iconBg: "bg-amber-500/20 text-amber-500 dark:text-amber-400 ring-1 ring-amber-500/40",
      titleColor: "text-amber-600 dark:text-amber-400",
      shadow: "shadow-xl shadow-amber-500/10",
    },
    info: {
      icon: Info,
      border: "border-sky-500/50 dark:border-sky-500/40",
      bg: "bg-sky-950/20 dark:bg-sky-950/40 via-card to-card backdrop-blur-xl bg-gradient-to-r from-sky-500/15",
      accentBar: "bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.7)]",
      iconBg: "bg-sky-500/20 text-sky-500 dark:text-sky-400 ring-1 ring-sky-500/40",
      titleColor: "text-sky-600 dark:text-sky-400",
      shadow: "shadow-xl shadow-sky-500/10",
    },
    default: {
      icon: CheckCircle2,
      border: "border-emerald-500/40 dark:border-emerald-500/30",
      bg: "bg-emerald-950/15 dark:bg-emerald-950/30 via-card to-card backdrop-blur-xl bg-gradient-to-r from-emerald-500/10",
      accentBar: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]",
      iconBg: "bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 ring-1 ring-emerald-500/30",
      titleColor: "text-emerald-600 dark:text-emerald-400",
      shadow: "shadow-xl shadow-emerald-500/10",
    },
  };

  const style = config[variant] || config.default;
  const IconComponent = style.icon;

  return (
    <div
      className={cn(
        "pointer-events-auto relative flex items-center gap-3.5 overflow-hidden rounded-2xl border p-4 transition-all duration-300 animate-in slide-in-from-top-4 fade-in-0",
        style.border,
        style.bg,
        style.shadow
      )}
    >
      {/* Thick Left Accent Bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl", style.accentBar)} />

      {/* Distinct Icon Container */}
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-2", style.iconBg)}>
        <IconComponent className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-0.5 pr-2">
        {item.title && (
          <h4 className={cn("text-sm font-bold tracking-tight", style.titleColor)}>
            {item.title}
          </h4>
        )}
        {item.description && (
          <p className="text-muted-foreground text-xs font-medium leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* Dismiss Button */}
      <button
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground hover:bg-accent/60 flex min-h-[32px] min-w-[32px] shrink-0 items-center justify-center rounded-xl p-1 transition-colors cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
