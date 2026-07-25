"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomSheet = DialogPrimitive.Root;
const BottomSheetTrigger = DialogPrimitive.Trigger;
const BottomSheetClose = DialogPrimitive.Close;
const BottomSheetPortal = DialogPrimitive.Portal;

const BottomSheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      className
    )}
    {...props}
  />
));
BottomSheetOverlay.displayName = "BottomSheetOverlay";

const BottomSheetContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <BottomSheetPortal>
    <BottomSheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "border-border bg-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-[24px] border-t p-6 shadow-2xl transition-transform duration-300 ease-out",
        className
      )}
      {...props}
    >
      {/* Touch Handle Bar */}
      <div className="bg-muted-foreground/30 mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full" />
      <div className="flex-1 overflow-y-auto">{children}</div>
      <DialogPrimitive.Close className="text-muted-foreground hover:bg-accent hover:text-foreground absolute top-4 right-4 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 transition-opacity focus:outline-none">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </BottomSheetPortal>
));
BottomSheetContent.displayName = "BottomSheetContent";

const BottomSheetHeader = ({ className, ...props }) => (
  <div className={cn("mb-4 flex flex-col space-y-1 text-left", className)} {...props} />
);
BottomSheetHeader.displayName = "BottomSheetHeader";

const BottomSheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-foreground text-lg font-bold tracking-tight", className)}
    {...props}
  />
));
BottomSheetTitle.displayName = "BottomSheetTitle";

const BottomSheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
BottomSheetDescription.displayName = "BottomSheetDescription";

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
};
