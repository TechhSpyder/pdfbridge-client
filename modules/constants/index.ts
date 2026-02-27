import {
  LayoutDashboard,
  Key,
  Settings,
  FileText,
  Banknote,
  BookOpen,
  Sparkles,
  PenTool,
  Users,
} from "lucide-react";

export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/lab", label: "AI Template Lab", icon: Sparkles },
  { href: "/dashboard/templates", label: "My Templates", icon: FileText },
  { href: "/dashboard/usage", label: "Usage", icon: FileText },
  { href: "/insights", label: "Insights", icon: Sparkles },
  { href: "/dashboard/blog", label: "Blog Journal", icon: PenTool },
  { href: "/dashboard/docs", label: "Documentation", icon: BookOpen },
  { href: "/dashboard/team", label: "Team Settings", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/billing", label: "Billing", icon: Banknote },
];

export const PLAN_METADATA: any = {
  "Test Mode": {
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
      "50 Conversions / month",
      "1 AI Template / month",
      "1 Team Seat",
      "10MB File Limit",
      "7 Days Retention",
      "No Webhooks",
    ],
    color: "slate",
  },
  Starter: {
    features: [
      "2,000 Conversions / month",
      "5 AI Templates / month",
      "100 Intelligent PDF Analyses / month",
      "Up to 5 Team Seats",
      "Native Tailwind Support",
      "Custom Headers/Footers",
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
      "50 AI Templates / month",
      "1,000 Intelligent PDF Analyses / month",
      "Up to 20 Team Seats",
      "Professional Print (CMYK, PDF/X)",
      "Ghost Mode (Private)",
      "50MB File Limit",
      "Unlimited Retention",
      "Everything in Starter",
    ],
    color: "emerald",
  },
  Enterprise: {
    features: [
      "Unlimited Conversions / year",
      "500 AI Templates / month",
      "10,000 Intelligent PDF Analyses / month",
      "IP Whitelisting Support",
      "100MB+ File Limit",
      "Everything in Pro",
    ],
    color: "blue",
  },
};
