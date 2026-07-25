import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("bg-muted/60 dark:bg-muted/30 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
