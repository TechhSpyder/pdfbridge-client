import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 3)}...${address.slice(-3)}`;
}
