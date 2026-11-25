"use client";

import React, { useEffect } from "react";
import { useToast } from "./use-toast";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertOctagon, AlertTriangle, Info, X } from "lucide-react";
import { playToastSound } from "@/lib/notification-sound";

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

  useEffect(() => {
    playToastSound(variant);
  }, [variant]);

  const config = {
    success: {
      icon: CheckCircle2,
      border: "border-border",
      bg: "bg-card",
      accentBar: "bg-teal-500",
      iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      titleColor: "text-foreground",
      shadow: "shadow-md",
    },
    error: {
      icon: AlertOctagon,
      border: "border-destructive/30",
      bg: "bg-card",
      accentBar: "bg-destructive",
      iconBg: "bg-destructive/10 text-destructive",
      titleColor: "text-foreground",
      shadow: "shadow-md",
    },
    warning: {
      icon: AlertTriangle,
      border: "border-border",
      bg: "bg-card",
      accentBar: "bg-amber-500",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      titleColor: "text-foreground",
      shadow: "shadow-md",
    },
    info: {
      icon: Info,
      border: "border-border",
      bg: "bg-card",
      accentBar: "bg-primary",
      iconBg: "bg-primary/10 text-primary",
      titleColor: "text-foreground",
      shadow: "shadow-md",
    },
    default: {
      icon: CheckCircle2,
      border: "border-border",
      bg: "bg-card",
      accentBar: "bg-primary",
      iconBg: "bg-primary/10 text-primary",
      titleColor: "text-foreground",
      shadow: "shadow-md",
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
          <p className="text-slate-600 dark:text-muted-foreground text-xs font-medium leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* Dismiss Button */}
      <button
        onClick={onDismiss}
        className="text-slate-500 hover:text-foreground hover:bg-accent/60 dark:text-muted-foreground flex min-h-[32px] min-w-[32px] shrink-0 items-center justify-center rounded-xl p-1 transition-colors cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
