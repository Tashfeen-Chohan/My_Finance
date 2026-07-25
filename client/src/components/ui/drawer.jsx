"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;
const DrawerPortal = DialogPrimitive.Portal;

const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = "DrawerOverlay";

const DrawerContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "bg-card border-border data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex h-full w-full max-w-sm flex-col p-6 shadow-2xl transition-transform duration-300 ease-in-out",
        side === "right" &&
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right top-0 right-0 border-l",
        side === "left" &&
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left top-0 left-0 border-r",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="text-muted-foreground hover:bg-accent hover:text-foreground absolute top-4 right-4 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 transition-opacity focus:outline-none">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1 text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-foreground text-lg font-bold tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

export { Drawer, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle };
