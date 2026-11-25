import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("bg-slate-200 dark:bg-slate-700/70 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
