import * as React from "react";
import { cva} from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] touch-manipulation select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:bg-primary/95",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        fab: "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90 rounded-full fixed bottom-20 right-4 z-40 md:bottom-8 md:right-8",
      },
      size: {
        default: "h-11 px-4 py-2 min-h-[44px]",
        sm: "h-9 rounded-lg px-3 text-xs min-h-[36px]",
        lg: "h-13 rounded-2xl px-6 text-base min-h-[48px]",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
        "fab-default":
          "h-14 w-14 min-h-[56px] min-w-[56px] rounded-full p-0 flex items-center justify-center",
        "fab-extended": "h-14 px-6 min-h-[56px] rounded-full flex items-center gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  (
    { className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin" />
        ) : leftIcon ? (
          <span className="mr-2 shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
