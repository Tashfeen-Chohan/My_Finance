"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Receipt, ExternalLink } from "lucide-react";
import { cleanReceiptUrl } from "@/utils/maintenance-utils";

export function ReceiptPreview({ url }) {
  if (!url) return null;

  const targetUrl = cleanReceiptUrl(url);

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 text-xs min-w-0 flex-1">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <Receipt className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-muted-foreground">Receipt Attached</p>
          <p className="text-xs font-medium text-foreground truncate">{url}</p>
        </div>
      </div>

      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-1.5 text-xs font-medium shrink-0"
        )}
      >
        <ExternalLink className="h-3.5 w-3.5" />
        View
      </a>
    </div>
  );
}
