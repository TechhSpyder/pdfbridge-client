import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium transition-all text-sm cursor-pointer active:scale-105 outline-none duration-200 flex items-center justify-center";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md",
    secondary:
      "bg-transparent border border-slate-700 text-white hover:bg-slate-800",
    outline:
      "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50",
    destructive:
      "bg-destructive border border-destructive text-white hover:bg-destructive/80",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
