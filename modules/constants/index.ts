import {
  LayoutDashboard,
  Key,
  Settings,
  Banknote,
  BookOpen,
  PenTool,
  Users,
  Activity,
  Compass,
  Terminal,
  FileText,
} from "lucide-react";

export const NAV_GROUPS = [
  {
    label: "Institutional Core",
    links: [
      { href: "/compiler", label: "Visual Compiler", icon: Terminal },
      { href: "/dashboard", label: "Processor", icon: LayoutDashboard },
      { href: "/dashboard/settlement", label: "Settlement Hub", icon: Compass },
      { href: "/dashboard/ledger", label: "Financial Ledger", icon: Activity },
    ],
  },
  {
    label: "Infrastructure",
    links: [
      { href: "/dashboard/api-keys", label: "API Hub", icon: Key },
      { href: "/dashboard/usage", label: "API Logs", icon: FileText },
      { href: "/dashboard/docs", label: "Documentation", icon: BookOpen },
    ],
  },
  {
    label: "Audit & Compliance",
    links: [
      { href: "/dashboard/billing", label: "Audit & Billing", icon: Banknote },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
      { href: "/dashboard/team", label: "Team Access", icon: Users },
    ],
  },
  {
    label: "Internal Utils",
    links: [{ href: "/dashboard/blog", label: "Blog Editor", icon: PenTool }],
  },
];

export const NAV_LINKS = NAV_GROUPS.flatMap((g) => g.links);

export const PLAN_METADATA: any = {
  "Test Mode": {
    price: "$0",
    sub: "Development sandboxing only",
    features: [
      "Unlimited invoice workflows",
      "Mandatory watermark on all output",
      "Development environment only",
      "24h document retention",
    ],
    color: "amber",
  },
  Builder: {
    price: "$0",
    sub: "Ideal for rapid testing and early integration",
    features: [
      "10 invoice workflows / mo",
      "10MB file limit",
      "7 days document retention",
      "Community support",
    ],
    color: "slate",
  },
  Startup: {
    price: "$19",
    sub: "For builders and early-stage products",
    features: [
      "150 invoice workflows / mo",
      "Webhooks & ERP integrations",
      "Financial data layer access",
      "10MB file limit",
      "7 days document retention",
      "Email support",
    ],
    color: "blue",
  },
  Growth: {
    price: "$99",
    sub: "For scaling institutional financial workflows",
    features: [
      "750 invoice workflows / mo",
      "Ghost Mode (private, no watermark)",
      "Tailwind CSS normalization",
      "Priority processing queue",
      "Unlimited document retention",
      "Everything in Startup",
    ],
    color: "emerald",
    recommended: true,
  },
  Scale: {
    price: "$499",
    sub: "For high-volume financial automation",
    features: [
      "5,000 invoice workflows / mo",
      "IP whitelisting & custom headers",
      "Audit-ready compliance infrastructure",
      "Dedicated account support",
      "Everything in Growth",
    ],
    color: "blue",
  },
  Enterprise: {
    price: "Custom",
    sub: "Handling millions of invoices monthly? Talk to us.",
    features: [
      "Custom throughput & SLA guarantees",
      "Dedicated infrastructure",
      "Full compliance & audit management",
      "White-glove onboarding",
      "Millions of invoices? Talk to us.",
    ],
    color: "blue",
  },
};

