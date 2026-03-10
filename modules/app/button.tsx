import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium transition-all text-sm cursor-pointer active:scale-95 outline-none duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 active:translate-y-0",
    secondary:
      "bg-transparent border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600",
    outline:
      "bg-transparent border border-blue-600/50 text-blue-400 hover:bg-blue-600/10 hover:border-blue-500",
    destructive:
      "bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
  };

  const buttonContent = (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  if (href) {
    return (
      <Link href={href} className="contents">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
};
