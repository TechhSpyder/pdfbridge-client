"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { forwardRef, ComponentPropsWithoutRef, ComponentRef } from "react";
import { cn } from "@/utils";

// ------------------
// Root & Trigger
// ------------------

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverPortal = PopoverPrimitive.Portal;

// ------------------
// Content
// ------------------

export const PopoverContent = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    className?: string;
  }
>(({ className, children, ...props }, ref) => (
  <PopoverPortal>
    <PopoverPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 rounded-lg border border-border bg-card min-w-[--radix-popover-trigger-width] p-4 shadow-lg animate-in fade-in-80",
        className,
      )}
      sideOffset={6} // default offset from trigger
      {...props}
    >
      {children}
      <PopoverPrimitive.Arrow className="fill-background" />
    </PopoverPrimitive.Content>
  </PopoverPortal>
));

PopoverContent.displayName = "PopoverContent";

// ------------------
// Header / Footer Helpers
// ------------------

export const PopoverHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1 text-left", className)}
    {...props}
  />
);

export const PopoverFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex justify-end gap-2 mt-2", className)} {...props} />
);
