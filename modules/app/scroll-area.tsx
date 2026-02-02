import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/utils";

/* ----------------------------------------------------------------------------
 * ScrollAreaRoot
 * --------------------------------------------------------------------------*/

type ScrollAreaElement = React.ComponentRef<typeof ScrollAreaPrimitive.Root>;
type ScrollAreaPrimitiveProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
>;

export interface ScrollAreaProps extends ScrollAreaPrimitiveProps {
  rootClassName?: string;
}

/* ----------------------------------------------------------------------------
 * ScrollAreaRoot
 * --------------------------------------------------------------------------*/

const SCROLLAREA_NAME = "ScrollAreaRoot";

const Root = React.forwardRef<ScrollAreaElement, ScrollAreaProps>(
  (props, ref) => {
    const { className, rootClassName, children, type, ...rootProps } = props;

    return (
      <ScrollAreaPrimitive.Root
        type={type}
        className={cn("relative h-full w-full overflow-hidden", rootClassName)}
      >
        <ScrollAreaPrimitive.Viewport
          ref={ref}
          className={cn(
            "h-full w-full rounded-[inherit] [&>div]:h-full",
            className,
          )}
          {...rootProps}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <Bar orientation="vertical" />
        <Bar orientation="horizontal" />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  },
);

Root.displayName = SCROLLAREA_NAME;

/* ----------------------------------------------------------------------------
 * ScrollAreaScrollbar
 * --------------------------------------------------------------------------*/

type ScrollBarElement = React.ComponentRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
>;
type ScrollBarPrimitiveProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
>;
export interface ScrollBarProps extends ScrollBarPrimitiveProps {}

/* ----------------------------------------------------------------------------
 * ScrollAreaScrollbar
 * --------------------------------------------------------------------------*/

const SCROLLBAR_NAME = "Scrollbar";

const Bar = React.forwardRef<ScrollBarElement, ScrollBarProps>((props, ref) => {
  const { className, orientation = "vertical", ...scrollBarProps } = props;

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors p-1px",
        orientation === "vertical" && "w-2.5",
        orientation === "horizontal" && "flex-col h-2.5 m-1",
        className,
      )}
      {...scrollBarProps}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-stroke-primary" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});

Bar.displayName = SCROLLBAR_NAME;

/* ----------------------------------------------------------------------------
 * Exports
 * --------------------------------------------------------------------------*/

const ScrollArea = {
  Root,
  Bar,
};

export default ScrollArea;
