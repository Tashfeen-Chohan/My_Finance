import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-border bg-card text-card-foreground rounded-2xl border shadow-sm transition-all duration-200",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const InteractiveCard = React.forwardRef(({ className, onClick, ...props }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    className={cn(
      "border-border bg-card text-card-foreground hover:border-primary/40 cursor-pointer touch-manipulation rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.99]",
      className
    )}
    {...props}
  />
));
InteractiveCard.displayName = "InteractiveCard";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-foreground text-lg leading-none font-semibold tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-muted-foreground text-sm", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

const MetricCard = React.forwardRef(({ title, value, description, icon, trend, className, ...props }, ref) => (
  <Card ref={ref} className={cn("glass-panel p-5", className)} {...props}>
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        {title}
      </span>
      {icon && <div className="text-primary bg-primary/10 rounded-xl p-2">{icon}</div>}
    </div>
    <div className="mt-3 flex items-baseline gap-2">
      <span className="text-foreground text-2xl font-bold tracking-tight">{value}</span>
      {trend && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold",
            trend.isPositive
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
          )}
        >
          {trend.value}
        </span>
      )}
    </div>
    {description && <p className="text-muted-foreground mt-1 text-xs">{description}</p>}
  </Card>
));
MetricCard.displayName = "MetricCard";

export {
  Card,
  InteractiveCard,
  MetricCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
