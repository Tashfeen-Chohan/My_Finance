import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "border-border bg-card/50 glass-panel mx-auto my-6 flex max-w-md flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center md:p-12",
        className
      )}
      {...props}
    >
      <div className="bg-primary/10 text-primary mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner">
        {icon || <FolderOpen className="h-8 w-8" />}
      </div>
      <h3 className="text-foreground text-lg font-bold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mt-1.5 max-w-sm text-sm leading-relaxed">{description}</p>

      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              leftIcon={primaryAction.icon}
              className="w-full sm:w-auto"
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="w-full sm:w-auto"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
