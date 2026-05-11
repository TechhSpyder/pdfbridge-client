"use client";

import React from "react";

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function UserAvatar({ name, image, className = "", size = "md" }: UserAvatarProps) {
  const [error, setError] = React.useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = name ? getInitials(name) : "?";

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-2xl",
  };

  const bgColors = [
    "bg-blue-600",
    "bg-indigo-600",
    "bg-purple-600",
    "bg-emerald-600",
    "bg-rose-600",
    "bg-amber-600",
  ];

  // Simple hash for consistent color per user
  const colorIndex = name
    ? name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % bgColors.length
    : 0;
  
  const bgColor = bgColors[colorIndex];

  if (image && !error) {
    return (
      <img
        src={image}
        alt={name || "User avatar"}
        className={`${sizeClasses[size]} rounded-full border border-white/10 object-cover ${className}`}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border border-white/10 flex items-center justify-center font-bold text-white shadow-inner ${bgColor} ${className}`}
    >
      {initials}
    </div>
  );
}
