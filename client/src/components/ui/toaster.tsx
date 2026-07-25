"use client";

import React from "react";
import { useToast, ToastItem } from "./use-toast";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-4 right-4 left-4 z-50 flex flex-col gap-2 md:left-auto md:w-96">
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
      ))}
    </div>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const icons = {
    default: <Info className="text-primary h-5 w-5" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="text-destructive h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-sky-500" />,
  };

  return (
    <div
      className={cn(
        "border-border bg-card animate-in slide-in-from-top-4 fade-in-0 pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300",
        item.variant === "success" && "border-emerald-500/30 bg-emerald-500/5",
        item.variant === "error" && "border-destructive/30 bg-destructive/5",
        item.variant === "warning" && "border-amber-500/30 bg-amber-500/5"
      )}
    >
      <div className="mt-0.5 shrink-0">{icons[item.variant || "default"]}</div>
      <div className="flex-1 space-y-0.5">
        {item.title && <h4 className="text-foreground text-sm font-semibold">{item.title}</h4>}
        {item.description && (
          <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground hover:bg-accent flex min-h-[36px] min-w-[36px] shrink-0 items-center justify-center rounded-lg p-1"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
