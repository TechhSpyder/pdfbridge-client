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
  Activity,
  Compass,
  Library,
} from "lucide-react";

export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/lab", label: "AI Template Lab", icon: Sparkles },
  { href: "/dashboard/templates", label: "My Templates", icon: Library },
  { href: "/dashboard/ledger", label: "Financial Ledger", icon: Banknote },
  { href: "/dashboard/usage", label: "Usage", icon: Activity },
  { href: "/insights", label: "Insights", icon: Compass },
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
  Developer: {
    features: [
      "2,000 Conversions / month",
      "100 AI Extractions / month",
      "5 Team Seats",
      "Native Tailwind Support",
      "Custom Headers/Footers",
      "25MB File Limit",
      "30 Days Retention",
      "Webhooks & ERP Ready",
    ],
    color: "blue",
  },
  Automation: {
    features: [
      "20,000 Conversions / month",
      "500 AI Extractions / month",
      "20 Team Seats",
      "Ghost Mode (Private)",
      "50MB File Limit",
      "Unlimited Retention",
      "Everything in Developer",
    ],
    color: "emerald",
    recommended: true,
  },
  Resilience: {
    features: [
      "100,000 Conversions / month",
      "Unlimited AI Extractions",
      "Unlimited Team Seats",
      "IP Whitelisting Support",
      "100MB+ File Limit",
      "Everything in Automation",
      "Audit-Ready Infrastructure",
    ],
    color: "blue",
  },
};
