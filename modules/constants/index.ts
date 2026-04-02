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

export const NAV_GROUPS = [
  {
    label: "General",
    links: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/ledger", label: "Financial Ledger", icon: Banknote },
      { href: "/dashboard/usage", label: "Usage", icon: Activity },
      { href: "/insights", label: "Insights", icon: Compass },
    ],
  },
  {
    label: "Engineering",
    links: [
      { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
      { href: "/dashboard/lab", label: "Engine Template Lab", icon: Sparkles },
      { href: "/dashboard/templates", label: "My Templates", icon: Library },
      { href: "/dashboard/blog", label: "Blog Journal", icon: PenTool },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: "/dashboard/docs", label: "Documentation", icon: BookOpen },
    ],
  },
  {
    label: "Account",
    links: [
      { href: "/dashboard/team", label: "Team Settings", icon: Users },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
      { href: "/dashboard/billing", label: "Billing", icon: Banknote },
    ],
  },
];

export const NAV_LINKS = NAV_GROUPS.flatMap((g) => g.links);

export const PLAN_METADATA: any = {
  "Test Mode": {
    features: [
      "Unlimited Processed Invoices",
      "Mandatory Watermark",
      "Development Only",
      "24h Retention",
    ],
    color: "amber",
  },
  Builder: {
    features: [
      "Includes 50 invoices / mo",
      "Built for testing and early integration",
      "Includes 5 financial extractions",
      "10MB File Limit",
      "7 Days Retention",
    ],
    color: "slate",
  },
  Startup: {
    features: [
      "Includes 2,000 invoices / mo",
      "Includes 100 extractions / mo",
      "Webhooks & ERP-ready",
      "Financial data layer access",
      "Tailwind normalization",
    ],
    color: "blue",
  },
  Growth: {
    features: [
      "Includes 20,000 invoices / mo",
      "Includes 500 extractions / mo",
      "Priority processing",
      "Ghost Mode (Private)",
      "Unlimited retention",
      "Everything in Startup",
    ],
    color: "emerald",
    recommended: true,
  },
  Scale: {
    features: [
      "Includes 100,000+ invoices / mo",
      "Unlimited extractions",
      "Financial data layer access",
      "Audit-ready infrastructure",
      "Everything in Growth",
    ],
    color: "blue",
  },
  Enterprise: {
    features: [
      "Custom throughput",
      "SLA-backed guarantees",
      "Dedicated infrastructure",
      "Custom pricing based on workload",
      "Handling millions of invoices monthly? Talk to us.",
    ],
    color: "blue",
  },
};
