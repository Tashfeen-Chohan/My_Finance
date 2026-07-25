"use client";

import React, { useState } from "react";
import { AlertOctagon, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this section. Please try again.",
  error,
  onRetry,
  className,
  ...props
}) {
  const [showDetails, setShowDetails] = useState(false);

  const errorMessage = typeof error === "string" ? error : error?.message;

  return (
    <div
      className={cn(
        "border-destructive/30 bg-destructive/5 glass-panel mx-auto my-6 flex max-w-md flex-col items-center justify-center rounded-2xl border p-6 text-center md:p-8",
        className
      )}
      {...props}
    >
      <div className="bg-destructive/15 text-destructive mb-3 flex h-14 w-14 items-center justify-center rounded-2xl">
        <AlertOctagon className="h-7 w-7" />
      </div>
      <h3 className="text-foreground text-base font-bold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{message}</p>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="destructive"
          size="sm"
          leftIcon={<RefreshCw className="h-4 w-4" />}
          className="mt-4"
        >
          Try Again
        </Button>
      )}

      {errorMessage && (
        <div className="mt-4 w-full text-left">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-muted-foreground hover:text-foreground mx-auto flex items-center gap-1 text-[11px] font-semibold"
          >
            <span>{showDetails ? "Hide technical details" : "Show technical details"}</span>
            {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {showDetails && (
            <pre className="bg-card border-border text-destructive mt-2 overflow-x-auto rounded-lg border p-3 font-mono text-[10px] whitespace-pre-wrap">
              {errorMessage}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
