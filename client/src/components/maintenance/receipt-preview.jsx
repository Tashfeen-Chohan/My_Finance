"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Receipt, ExternalLink } from "lucide-react";
import { cleanReceiptUrl } from "@/utils/maintenance-utils";

export function ReceiptPreview({ url }) {
  if (!url) return null;

  const targetUrl = cleanReceiptUrl(url);

  return (
    <div className="rounded-xl border-2 border-slate-300 dark:border-border/50 bg-slate-50/80 dark:bg-secondary/20 p-3 flex items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2.5 text-xs min-w-0 flex-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500">
          <Receipt className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Maintenance Receipt
          </p>
          <p className="text-xs font-medium text-foreground truncate">{url}</p>
        </div>
      </div>

      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-1.5 cursor-pointer border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl text-xs font-semibold shrink-0"
        )}
      >
        <ExternalLink className="h-3.5 w-3.5" />
        View Receipt
      </a>
    </div>
  );
}
