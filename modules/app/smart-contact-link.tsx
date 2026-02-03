"use client";

import React from "react";
import { useClipboard } from "@/modules/hooks/use-copy-to-clipboard";
import { cn } from "@/utils";
import { useWindowSize } from "@uidotdev/usehooks";

interface SmartContactLinkProps {
  email: string;
  children?: React.ReactNode;
  className?: string;
  isButton?: boolean;
}

export function SmartContactLink({
  email,
  children,
  className,
  isButton = false,
}: SmartContactLinkProps) {
  const { copy } = useClipboard();
  const { width } = useWindowSize();
  const isMobileScreen = width && width < 768;

  const handleClick = (e: React.MouseEvent) => {
    if (!isMobileScreen) {
      e.preventDefault();
      copy(email, `Email copied to clipboard: ${email}`);
    }
  };

  if (isButton) {
    return (
      <button onClick={handleClick} className={cn("cursor-pointer", className)}>
        {children || email}
      </button>
    );
  }

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      className={cn("cursor-pointer", className)}
    >
      {children || email}
    </a>
  );
}
