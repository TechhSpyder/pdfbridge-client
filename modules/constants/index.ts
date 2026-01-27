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
  Test: {
    features: [
      "Unlimited Conversions",
      "Mandatory Watermark",
      "Development Only",
      "24h Retention",
    ],
    color: "amber",
  },
  Free: {
    features: [
      "5 Conversions / month",
      "10MB File Limit",
      "7 Days Retention",
      "No Webhooks",
    ],
    color: "slate",
  },
  Starter: {
    features: [
      "2,000 Conversions / month",
      "25MB File Limit",
      "30 Days Retention",
      "Webhooks Included",
    ],
    color: "blue",
    recommended: true,
  },
  Pro: {
    features: [
      "20,000 Conversions / month",
      "50MB File Limit",
      "Custom Headers/Footers",
      "Unlimited Retention",
    ],
    color: "emerald",
  },
  Enterprise: {
    features: [
      "Custom High Volume",
      "100MB+ File Limit",
      "Dedicated Infrastructure",
      "Priority SLA Support",
    ],
    color: "blue",
  },
};
