/* -----------------------------------------------------------------------------
 * Imports
 * ----------------------------------------------------------------------------*/

import { cn } from "@/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

/* -----------------------------------------------------------------------------
 *  Extend Primitives Radix
 * ----------------------------------------------------------------------------*/

const DialogRoot = DialogPrimitive.Root;
const DialogDescription = DialogPrimitive.Description;
const DialogPortal = DialogPrimitive.Portal;

/* ----------------------------------------------------------------------------
 * Dialog - Trigger
 * ---------------------------------------------------------------------------*/

const TRIGGER_NAME = "DialogTrigger";

type DialogTriggerElement = React.ElementRef<typeof DialogPrimitive.Trigger>;
type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;

const DialogTrigger = React.forwardRef<
  DialogTriggerElement,
  DialogTriggerProps
>((props, ref) => {
  const { asChild = true, ...triggerProps } = props;

  return (
    <DialogPrimitive.Trigger ref={ref} asChild={asChild} {...triggerProps} />
  );
});

DialogTrigger.displayName = TRIGGER_NAME;

/* -----------------------------------------------------------------------------
 * Dialog - Overlay
 * ----------------------------------------------------------------------------*/

const OVERLAY_NAME = "DialogOverlay";

type DialogOverlayElement = React.ElementRef<typeof DialogPrimitive.Overlay>;
type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>;

const DialogOverlay = React.forwardRef<
  DialogOverlayElement,
  DialogOverlayProps
>((props, ref) => {
  const { className, ...overlayProps } = props;

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 grid place-items-center overflow-y-auto bg-black/80 max-md:px-5",
        "data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide",
        className,
      )}
      {...overlayProps}
    />
  );
});

DialogOverlay.displayName = OVERLAY_NAME;

/* ----------------------------------------------------------------------------
 * Dialog - Content
 * ---------------------------------------------------------------------------*/

const CONTENT_NAME = "DialogContent";

type DialogContentElement = React.ElementRef<typeof DialogPrimitive.Content>;
type DialiogContentCustomProps = { overlayClassName?: string };
type DialogContentProps = React.ComponentPropsWithoutRef<"div"> &
  DialiogContentCustomProps;

const DialogContent = React.forwardRef<
  DialogContentElement,
  DialogContentProps
>((props, ref) => {
  const { className, children, overlayClassName, ...contentProps } = props;

  return (
    <DialogPortal>
      <DialogOverlay
        className={cn("bg-black backdrop-blur-md", overlayClassName)}
      >
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "mx-auto flex max-h-[80vh] w-[calc(100%-24px)] max-w-[620px] flex-col rounded-3xl z-50",
            "border-accent bg-muted border shadow-lg shadow-black/10 outline-none focus-within:outline-none",
            "data-[state=open]:animate-dialogShow data-[state=closed]:animate-dialogHide transition-all duration-200 ease-out",
            className,
          )}
          {...contentProps}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  );
});

DialogContent.displayName = CONTENT_NAME;

/* ----------------------------------------------------------------------------
 * Dialog - Header
 * ---------------------------------------------------------------------------*/

const HEADER_NAME = "DialogHeader";

type DialogHeaderProps = React.ComponentProps<"div">;

const DialogHeader = (props: DialogHeaderProps) => {
  const { className, ...headerProps } = props;

  return (
    <div
      className={cn(
        "border-border flex w-full items-center justify-between border-b p-5 pt-6 text-left",
        className,
      )}
      {...headerProps}
    />
  );
};

DialogHeader.displayName = HEADER_NAME;

/* ----------------------------------------------------------------------------
 * Dialog - Body
 * ---------------------------------------------------------------------------*/

const BODY_NAME = "DialogBody";

type DialogBodyProps = React.ComponentProps<"div">;

const DialogBody = (props: DialogBodyProps) => {
  const { className, ...bodyProps } = props;

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-between gap-8 overflow-y-auto p-5",
        className,
      )}
      {...bodyProps}
    />
  );
};

DialogBody.displayName = BODY_NAME;

/* ----------------------------------------------------------------------------
 * Dialog - Title
 * ---------------------------------------------------------------------------*/

const TITLE_NAME = "DialogTitle";

type DialogTitleElement = React.ElementRef<typeof DialogPrimitive.Title>;
type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const DialogTitle = React.forwardRef<DialogTitleElement, DialogTitleProps>(
  (props, ref) => {
    const { className, ...titleProps } = props;

    return (
      <DialogPrimitive.Title
        ref={ref}
        className={cn(
          "text-foreground text-xl leading-5 font-medium text-balance",
          className,
        )}
        {...titleProps}
      />
    );
  },
);

DialogTitle.displayName = TITLE_NAME;

/* ----------------------------------------------------------------------------
 * Dialog - Close
 * ---------------------------------------------------------------------------*/

const CLOSE_NAME = "DialogClose";

/* -------------------------------------------------------------------------------------------------
 * Footer
 * -----------------------------------------------------------------------------------------------*/

const FOOTER_NAME = "DialogFooter";
type FooterElement = React.ElementRef<"div">;
type FooterProps = React.ComponentPropsWithoutRef<"div">;

const DialogFooter = React.forwardRef<FooterElement, FooterProps>(
  (props, ref) => {
    const { className, ...footerProps } = props;
    return (
      <div
        className={cn("flex justify-end px-5 py-4", className)}
        {...footerProps}
        ref={ref}
      />
    );
  },
);

DialogFooter.displayName = FOOTER_NAME;

type DialogCloseElement = React.ElementRef<typeof DialogPrimitive.Close>;
type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;

const DialogClose = React.forwardRef<DialogCloseElement, DialogCloseProps>(
  (props, ref) => {
    const { asChild = true, ...closeProps } = props;

    return (
      <DialogPrimitive.Close ref={ref} asChild={asChild} {...closeProps} />
    );
  },
);

DialogClose.displayName = CLOSE_NAME;

/* ----------------------------------------------------------------------------
 * Exports
 * ---------------------------------------------------------------------------*/

export const Dialog = Object.assign(
  {},
  {
    Root: DialogRoot,
    Trigger: DialogTrigger,
    Content: DialogContent,
    Body: DialogBody,
    Title: DialogTitle,
    Description: DialogDescription,
    Header: DialogHeader,
    Footer: DialogFooter,
    Close: DialogClose,
  },
);
