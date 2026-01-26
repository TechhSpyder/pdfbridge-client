import {
  LayoutDashboard,
  Key,
  Settings,
  FileText,
  Banknote,
} from "lucide-react";

export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/usage", label: "Usage", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/billing", label: "Billing", icon: Banknote },
];

export const PLAN_METADATA: any = {
  Free: {
    features: [
      "5 Conversions / month",
      "Standard Latency",
      "Public CDN Storage",
      "Community Support",
    ],
    color: "slate",
  },
  Starter: {
    features: [
      "2,000 Conversions / month",
      "Priority Queueing",
      "Secure Private Storage",
      "99.9% Uptime SLA",
      "Email Support",
    ],
    color: "blue",
    recommended: true,
  },
  Pro: {
    features: [
      "20,000 Conversions / month",
      "Ultra-Low Latency",
      "Custom Webhooks",
      "Enhanced Security (MFA)",
      "24/7 Priority Support",
    ],
    color: "emerald",
  },
};
