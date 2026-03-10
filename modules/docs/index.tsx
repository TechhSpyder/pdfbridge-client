"use client";

import { useState } from "react";
import Link from "next/link";
import { GlowCard } from "../app/glow-card";
import {
  Book,
  Key,
  Terminal,
  Webhook,
  Layout,
  FileCode,
  Info,
  Code2,
  Cpu,
  Users,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { useActiveSection } from "../hooks/use-active-section";
import { useEffect } from "react";

const DOCUMENTATION_GROUPS = [
  {
    title: "Getting Started",
    items: [
      {
        id: "intro",
        title: "Introduction",
        icon: <Book className="h-4 w-4" />,
      },
      {
        id: "auth",
        title: "Authentication",
        icon: <Key className="h-4 w-4" />,
      },
      {
        id: "usage",
        title: "Usage & Credits",
        icon: <Info className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Core API",
    items: [
      {
        id: "convert",
        title: "Convert PDF",
        icon: <FileCode className="h-4 w-4" />,
      },
      {
        id: "bulk",
        title: "Bulk Conversion",
        icon: <Cpu className="h-4 w-4" />,
      },
      {
        id: "templates",
        title: "Dynamic Templates",
        icon: <Sparkles className="h-4 w-4 text-indigo-400" />,
      },
      {
        id: "options",
        title: "Options Reference",
        icon: <Layout className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Advanced Features",
    items: [
      {
        id: "tailwind",
        title: "Tailwind-Native",
        icon: <Code2 className="h-4 w-4" />,
      },
      {
        id: "ai",
        title: "Intelligent Extraction",
        icon: <Cpu className="h-4 w-4" />,
      },
      {
        id: "jobs",
        title: "Job Polling Flow",
        icon: <Info className="h-4 w-4" />,
      },
      { id: "ghost", title: "Ghost Mode", icon: <Info className="h-4 w-4" /> },
    ],
  },
  {
    title: "Integrations & Teams",
    items: [
      {
        id: "team",
        title: "Team Management",
        icon: <Users className="h-4 w-4" />,
      },
      {
        id: "n8n",
        title: "n8n Integration",
        icon: <Webhook className="h-4 w-4" />,
      },
      {
        id: "webhooks",
        title: "Webhooks",
        icon: <Webhook className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Technical Reference",
    items: [
      {
        id: "api-ref",
        title: "Full API Reference",
        icon: <Terminal className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "SDKs & Client Libraries",
    items: [
      {
        id: "node-sdk",
        title: "Node.js SDK",
        icon: <Terminal className="h-4 w-4" />,
      },
      {
        id: "python-sdk",
        title: "Python SDK",
        icon: <Terminal className="h-4 w-4" />,
      },
    ],
  },
];

const SECTIONS = DOCUMENTATION_GROUPS.flatMap((g) => g.items);

function SidebarGroup({
  group,
  activeSection,
  setActiveSection,
  isExpanded,
  onToggle,
}: {
  group: any;
  activeSection: string;
  setActiveSection: (id: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-4 lg:mb-4 shrink-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors whitespace-nowrap"
      >
        {group.title}
        {isExpanded ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-1 mt-2">
          {group.items.map((section: any) => (
            <button
              key={section.id}
              onClick={() => {
                if (section.id === "api-ref") {
                  window.location.href = "/docs/api-reference";
                  return;
                }
                setActiveSection(section.id);
                document
                  .getElementById(section.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeSection === section.id
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)] cursor-default"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent cursor-pointer"
              }`}
            >
              <div
                className={
                  activeSection === section.id
                    ? "text-blue-500"
                    : "text-slate-500"
                }
              >
                {section.icon}
              </div>
              {section.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Documentation({
  noContainer = false,
}: {
  noContainer?: boolean;
}) {
  const [activeSection, setActiveSection] = useState("intro");
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(
    DOCUMENTATION_GROUPS[0].title,
  );
  const [copiedBaseUrl, setCopiedBaseUrl] = useState(false);

  const sectionIds = SECTIONS.map((s) => s.id);
  const activeId = useActiveSection(sectionIds);

  useEffect(() => {
    if (activeId) {
      setActiveSection(activeId);
      // Auto-expand group that contains activeId
      const group = DOCUMENTATION_GROUPS.find((g) =>
        g.items.some((i) => i.id === activeId),
      );
      if (group) setExpandedGroupId(group.title);
    }
  }, [activeId]);

  const copyBaseUrl = () => {
    navigator.clipboard.writeText("https://api.pdfbridge.xyz/api/v1");
    setCopiedBaseUrl(true);
    setTimeout(() => setCopiedBaseUrl(false), 2000);
  };

  const content = (
    <div className="flex flex-col lg:flex-row gap-12 items-start w-full max-lg:overflow-x-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 z-30">
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide lg:space-y-1 -mx-4 px-4 lg:mx-0 lg:px-0">
          {DOCUMENTATION_GROUPS.map((group) => (
            <SidebarGroup
              key={group.title}
              group={group}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              isExpanded={expandedGroupId === group.title}
              onToggle={() =>
                setExpandedGroupId(
                  expandedGroupId === group.title ? null : group.title,
                )
              }
            />
          ))}

          <div className="hidden lg:block pt-6 mt-6 border-t border-white/5 space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
              Product
            </p>
            <Link
              href="/#features"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Layout className="h-4 w-4" />
              Features
            </Link>
            <Link
              href="/#pricing"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Layout className="h-4 w-4" />
              Pricing
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-20 min-w-0 max-w-full overflow-hidden">
        {/* Introduction */}
        <section
          id="intro"
          className="scroll-mt-24 space-y-6 text-slate-300 leading-relaxed"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Book className="h-3 w-3" /> Get Started
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Introduction
          </h1>
          <p>
            PDFBridge is a powerful API for developers who need scale, security,
            and precision. All generated PDFs are stored according to your{" "}
            <Link
              href="/dashboard/billing"
              className="text-blue-400 hover:underline"
            >
              plan&apos;s retention policy
            </Link>{" "}
            (ranging from 7 to 30+ days) before being automatically purged,
            unless <span className="font-bold text-white">Ghost Mode</span> is
            used.
          </p>
          <GlowCard
            title="Base URL / API Versioning"
            sub="Production: v1 (Latest)"
            icon={<Info className="h-5 w-5 text-blue-400" />}
            content={
              <div className="space-y-4 mt-4">
                <div className="relative group">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-sm text-blue-400 pr-12 break-all">
                    https://api.pdfbridge.xyz/api/v1
                  </div>
                  <button
                    onClick={copyBaseUrl}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copiedBaseUrl ? (
                      <span className="text-[10px] font-bold text-emerald-400 px-1">
                        Copied!
                      </span>
                    ) : (
                      <Terminal className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            }
          />
        </section>

        {/* Authentication */}
        <section id="auth" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Key className="text-blue-500" /> Authentication
          </h2>
          <p className="text-slate-400 leading-relaxed">
            PDFBridge uses a <strong>Dual API Key</strong> system. You are
            assigned two keys upon signup:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5">
              <h4 className="font-bold text-orange-400 text-sm">
                Test Key (pk_test_...)
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Unlimited testing. Every PDF will have a large diagonal
                watermark. Does not count against your quota.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
              <h4 className="font-bold text-blue-400 text-sm">
                Live Key (pk_live_...)
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Production usage. Clean PDFs. Usage counts against your plan's
                monthly conversion quota.
              </p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Include your key in the{" "}
            <code className="text-blue-400 font-mono bg-blue-400/5 px-1.5 py-0.5 rounded break-all">
              x-api-key
            </code>{" "}
            header for all requests.
          </p>
          <CodeBlock
            code={`curl -X POST https://api.pdfbridge.xyz/api/v1/convert \\
  -H "x-api-key: pk_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}
            language="bash"
          />
        </section>

        {/* Usage & Credits */}
        <section id="usage" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Info className="text-blue-500" /> Usage & Credits
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Each conversion job counts towards your plan's monthly credit limit.
            To ensure fair infrastructure usage, credits are calculated based on
            the final PDF file size.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-white/5 bg-white/5 space-y-3">
              <h4 className="font-bold text-white text-sm">Standard Credits</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                1 credit is deducted for any document up to your plan's base
                size limit (e.g., 10MB on Free Tier).
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-blue-500/10 bg-blue-500/5 space-y-3">
              <h4 className="font-bold text-blue-400 text-sm">
                Dynamic Scaling
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                If a document exceeds the base unit, 1 extra credit is deducted
                per additional unit (or part thereof).
              </p>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm">
            <h4 className="font-bold text-white text-sm mb-4">
              Calculation Table (Free Tier Example)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full min-w-[500px] text-left text-xs">
                <thead>
                  <tr className="bg-white/5 text-slate-300">
                    <th className="px-4 py-3 font-semibold">File Size</th>
                    <th className="px-4 py-3 font-semibold">
                      Credits Deducted
                    </th>
                    <th className="px-4 py-3 font-semibold">Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-400">
                  <tr>
                    <td className="px-4 py-3">0.5 MB - 10.0 MB</td>
                    <td className="px-4 py-3 text-white font-mono">1</td>
                    <td className="px-4 py-3 italic font-light">Base cost</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">10.1 MB - 20.0 MB</td>
                    <td className="px-4 py-3 text-white font-mono">2</td>
                    <td className="px-4 py-3 font-light">+1 extra credit</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">20.1 MB - 30.0 MB</td>
                    <td className="px-4 py-3 text-white font-mono">3</td>
                    <td className="px-4 py-3 font-light">+2 extra credits</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Convert PDF */}
        <section id="convert" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <FileCode className="text-emerald-500" /> Convert PDF
          </h2>
          <p className="text-slate-400">
            Convert a public URL or raw HTML string into a PDF document. This
            operation is asynchronous and returns a{" "}
            <code className="text-blue-400 font-mono">jobId</code>.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 font-bold">
                POST
              </span>
              <span className="text-slate-200">/convert</span>
            </div>
            <CodeBlock
              code={`{
  "url": "https://stripe.com",
  "filename": "monthly_invoice_january",
  "webhookUrl": "https://your-app.com/api/webhooks/pdf",
  "ghostMode": true,
  "options": {
    "format": "A4",
    "printBackground": true
  }
}`}
              language="json"
            />
          </div>
        </section>

        {/* Bulk Conversion */}
        <section id="bulk" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Cpu className="text-amber-500" /> Bulk Conversion
          </h2>
          Process up to 1,000 conversions in a single request. Highly efficient
          for generating large sets of documents like monthly invoices.
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 font-bold">
                POST
              </span>
              <span className="text-slate-200">/convert/bulk</span>
            </div>
            <CodeBlock
              code={`{
  "jobs": [
    { "url": "https://site.com/doc1", "filename": "doc1" },
    { "url": "https://site.com/doc2", "filename": "doc2" }
  ]
}`}
              language="json"
            />
          </div>
        </section>

        {/* Dynamic Templates */}
        <section id="templates" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Sparkles className="text-indigo-500" /> Dynamic Templates
          </h2>
          <p className="text-slate-400 leading-relaxed">
            PDFBridge supports dynamic content injection using{" "}
            <strong className="text-white">Handlebars-style</strong> variables.
            You can define placeholders like{" "}
            <code className="text-indigo-400 font-mono">{"{{name}}"}</code> in
            your HTML and provide values at conversion time.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <GlowCard
              title="Variable Syntax"
              sub="Double-curly braces"
              content={
                <p className="text-xs text-slate-500 leading-relaxed mt-2">
                  Use{" "}
                  <code className="text-indigo-400">{"{{variable_name}}"}</code>{" "}
                  anywhere in your HTML. Supports dot notation for nested
                  objects (e.g.,{" "}
                  <code className="text-indigo-400">{"{{user.name}}"}</code>).
                </p>
              }
            />
            <GlowCard
              title="Ad-hoc Usage"
              sub="No template required"
              content={
                <p className="text-xs text-slate-500 leading-relaxed mt-2">
                  Pass variables directly with your raw HTML. The engine
                  automatically detects and merges them before rendering.
                </p>
              }
            />
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Example Payload</h4>
            <CodeBlock
              code={`{
  "html": "<h1>Hello {{name}}!</h1><p>Invoice #{{inv_id}}</p>",
  "variables": {
    "name": "Jane Doe",
    "inv_id": "99342"
  }
}`}
              language="json"
            />
          </div>
        </section>

        {/* Options Reference */}
        <section id="options" className="scroll-mt-24 space-y-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Layout className="text-indigo-500" /> Options Reference
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <GlowCard
              title="Page Formats"
              sub="Available: A4, Letter, Legal, Tabloid, Ledger, A3"
              content={
                <div className="space-y-2 mt-2">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Standard Chromium paper sizes. Default is A4.
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Set <code className="text-indigo-400">landscape: true</code>{" "}
                    or{" "}
                    <code className="text-indigo-400">
                      orientation: 'landscape'
                    </code>{" "}
                    for horizontal layouts.
                  </p>
                </div>
              }
            />
            <GlowCard
              title="Custom Dimensions"
              sub="paperWidth, paperHeight, preferCSSPageSize"
              content={
                <div className="space-y-2 mt-2">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Override standard formats with custom values (numbers in{" "}
                    <strong>mm</strong> or strings like "10in").
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Use{" "}
                    <code className="text-indigo-400">
                      preferCSSPageSize: true
                    </code>{" "}
                    to respect <code>@page</code> rules in your CSS.
                  </p>
                </div>
              }
            />
            <GlowCard
              title="Precise Margins"
              sub="marginTop, marginBottom, marginLeft, marginRight"
              content={
                <div className="space-y-2 mt-2">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Define margins globally via{" "}
                    <code className="text-indigo-400">margin</code> or use
                    individual overrides for pixel-perfect control.
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Supports numbers (mm) or strings (e.g., "0.5in", "20px").
                  </p>
                </div>
              }
            />
            <GlowCard
              title="Rendering Engine"
              sub="waitDelay, userAgent, width, height"
              content={
                <div className="space-y-2 mt-2">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tune the generator for complex sites. Default width is{" "}
                    <strong>1440px</strong> for URLs.
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Use <code className="text-indigo-400">waitDelay: "5s"</code>{" "}
                    to wait for JS hydration or heavy animations.
                  </p>
                </div>
              }
            />
            <GlowCard
              className="md:col-span-2"
              title="Header & Footer"
              sub="HTML Templates & Placeholders"
              content={
                <div className="space-y-2 mt-2">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Set{" "}
                    <code className="text-blue-400">
                      displayHeaderFooter: true
                    </code>
                    . Use these classes for dynamic data:
                  </p>
                  <ul className="text-[10px] text-slate-400 space-y-1 ml-2">
                    <li>
                      • <code className="text-emerald-400">pageNumber</code>:
                      Current page
                    </li>
                    <li>
                      • <code className="text-emerald-400">totalPages</code>:
                      Total pages
                    </li>
                    <li>
                      • <code className="text-emerald-400">date</code>:
                      Rendering date
                    </li>
                    <li>
                      • <code className="text-emerald-400">title</code>:
                      Document title
                    </li>
                  </ul>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Set a document title via{" "}
                    <code className="text-indigo-400">
                      options.metadata.title
                    </code>{" "}
                    to enable PDF/A compliance.
                  </p>
                </div>
              }
            />
          </div>
        </section>

        {/* Tailwind-Native */}
        <section id="tailwind" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Code2 className="text-blue-400" /> Tailwind-Native
          </h2>
          <p className="text-slate-400 leading-relaxed">
            PDFBridge features native support for Tailwind CSS. You can use any
            utility classes directly in your HTML payloads without manually
            linking stylesheets or configuring complex build pipelines.
          </p>

          <GlowCard
            title="How it Works"
            sub="Automatic JIT Injection"
            icon={<Info className="h-5 w-5 text-blue-400" />}
            content={
              <div className="space-y-4 mt-4 text-sm text-slate-400">
                <p>
                  When you set{" "}
                  <code className="text-blue-400 font-mono">
                    tailwind: true
                  </code>{" "}
                  in your request:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    The engine automatically injects the Tailwind Play CDN
                    script.
                  </li>
                  <li>
                    The generator waits until the JIT compiler has fully
                    rendered your styles before taking the snapshot.
                  </li>
                  <li>You get a pixel-perfect Tailwind PDF every time.</li>
                </ol>
              </div>
            }
          />

          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Example Payload</h4>
            <CodeBlock
              code={`{
  "html": "<div class='bg-blue-600 p-12 text-white text-center rounded-3xl shadow-2xl'>
    <h1 class='text-4xl font-black mb-4'>Tailwind-Native</h1>
    <p class='text-blue-100'>No setup. No hacks. Just CSS utilities.</p>
  </div>",
  "tailwind": true
}`}
              language="json"
            />
          </div>
        </section>

        {/* Team Management */}
        <section id="team" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Users className="text-blue-400" /> Team Management
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Collaborate with your team seamlessly. Invite members, manage roles,
            and share templates across your organization.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
              <h4 className="font-bold text-white text-sm">
                Role-Based Access
              </h4>
              <p className="text-xs text-slate-500">
                Owners have full billing and seat control, while Members can
                create and manage templates.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
              <h4 className="font-bold text-white text-sm">Shared Resources</h4>
              <p className="text-xs text-slate-500">
                All templates and API keys are shared within the organization,
                ensuring consistent output.
              </p>
            </div>
          </div>
        </section>

        {/* Intelligent Extraction */}
        <section id="ai" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Cpu className="text-purple-400" /> Intelligent Extraction
          </h2>
          <p className="text-slate-400 leading-relaxed">
            PDFBridge features a high-performance extraction engine designed for 
            <strong>Financial Document Automation</strong>. Use the specialized 
            <code className="text-blue-400">/extract</code> endpoint to upload 
            existing PDF invoices and receive strict, typed JSON in seconds.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <GlowCard
              title="Bill To & Vendor Recognition"
              sub="Zero Hallucination"
              content={
                <p className="text-xs text-slate-500 leading-relaxed mt-2">
                  Our model is fine-tuned to distinguish between the party issuing the invoice 
                  and the "Bill To" party, preventing metadata mismatches.
                </p>
              }
            />
            <GlowCard
              title="Direct Pipeline"
              sub="Faster & More Secure"
              content={
                <p className="text-xs text-slate-500 leading-relaxed mt-2">
                  Uploading PDFs directly to <code className="text-blue-300">/extract</code> 
                  is 5x faster than rendering via headless browser.
                </p>
              }
            />
          </div>

          <div className="space-y-4">
             <h4 className="font-bold text-white text-sm">Example Workflow (cURL)</h4>
             <CodeBlock 
                code={`curl -X POST https://api.pdfbridge.xyz/api/v1/extract \\
  -H "x-api-key: pk_live_..." \\
  -F "file=@invoice.pdf"`}
                language="bash"
             />
          </div>
        </section>

        {/* Job Polling Flow */}
        <section id="jobs" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Info className="text-blue-500" /> Job Polling Flow
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Since PDF generation and AI extraction are complex asynchronous tasks, the API 
            immediately returns a <code className="text-blue-400">jobId</code>. You should 
            poll for the final result or rely on <Link href="#webhooks" className="text-blue-400 hover:underline">Webhooks</Link>.
          </p>

          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Polling Example</h4>
            <CodeBlock 
                code={`// Poll every 1-2 seconds until status is SUCCESS
const response = await fetch("https://api.pdfbridge.xyz/api/v1/jobs/JOB_ID", {
  headers: { "x-api-key": "..." }
});
const job = await response.json();

if (job.status === "SUCCESS") {
  console.log("Extraction Results:", job.result.aiMetadata);
}`}
                language="javascript"
            />
          </div>
        </section>

        {/* n8n Integration */}
        <section id="n8n" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Webhook className="text-orange-500" /> n8n Integration
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Connect PDFBridge to 400+ applications using our custom n8n node.
            Automate your document generation workflows without writing code.
          </p>

          <GlowCard
            title="Professional Automation"
            sub="No-Code Document Workflows"
            icon={<Info className="h-5 w-5 text-orange-400" />}
            content={
              <div className="space-y-4 mt-4 text-sm text-slate-400 leading-relaxed">
                <p>
                  Our <strong>n8n Community Node</strong> allows you to
                  integrate PDFBridge directly into your automated pipelines.
                  Whether you're generating invoices from a database or
                  summaries from web scrapers, the n8n node provides a visual
                  interface for configuring every aspect of the conversion.
                </p>
                <p>
                  The node supports all core API features, including
                  Tailwind-Native rendering, Intelligent PDF analysis, and
                  custom formatting options, making it the ideal choice for
                  enterprise-grade automation.
                </p>
              </div>
            }
          />

          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">How to use it:</h4>
            <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm space-y-4">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                  1
                </div>
                <div>
                  <h5 className="text-white font-bold text-sm">Install Node</h5>
                  <p className="text-xs text-slate-500 mt-1">
                    In your n8n settings, go to "Community Nodes" and install:
                    <br />
                    <code className="text-emerald-400 font-mono">
                      n8n-nodes-pdfbridge
                    </code>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                  2
                </div>
                <div>
                  <h5 className="text-white font-bold text-sm">
                    Add Your Secret Key
                  </h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Copy your API Key from the dashboard and paste it into the
                    node's credentials.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                  3
                </div>
                <div>
                  <h5 className="text-white font-bold text-sm">
                    Start Printing!
                  </h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Drag the PDFBridge node into your workflow, give it a URL,
                    and watch the magic happen!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Webhooks */}
        <section id="webhooks" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Webhook className="text-purple-500" /> Webhooks
          </h2>
          <p className="text-slate-400">
            Set a <code className="text-purple-400">webhookUrl</code> in your
            request to receive a POST callback when document generation is
            finished or if it fails.
          </p>
          <CodeBlock
            code={`{
  "event": "pdf.generated",
  "jobId": "4ce4fc3a-2865-4404-933c-22da12f19679",
  "status": "completed",
  "url": "https://api.pdfbridge.xyz/api/v1/jobs/id/download"
}`}
            language="json"
          />

          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">
              Cryptographic Verification (HMAC-SHA256)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every webhook sent by PDFBridge includes an{" "}
              <code className="text-blue-400">X-PDFBridge-Signature</code>{" "}
              header. This allows you to verify that the notification came from
              us and has not been altered in transit.
            </p>
            <CodeBlock
              code={`const crypto = require('crypto');

// The raw body of the POST request
const payload = JSON.stringify(req.body); 
const signature = req.headers['x-pdfbridge-signature'];
const secret = process.env.PDFBRIDGE_WEBHOOK_SECRET;

const hmac = crypto.createHmac('sha256', secret);
const digest = hmac.update(payload).digest('hex');

if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
  console.log("Verified! Process the PDF...");
} else {
  console.error("Invalid signature. Rejecting request.");
}`}
              language="javascript"
            />
          </div>

          <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-6 space-y-3">
            <h4 className="font-bold text-indigo-400 text-sm flex items-center gap-2">
              <Info className="h-4 w-4" /> Webhook Inspector
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Debug your integrations with our built-in{" "}
              <strong>Webhook Inspector</strong>. View delivery logs, response
              bodies, and latency for every attempt directly in the
              <strong> Usage Dashboard</strong>. Note: Webhooks are a paid-tier
              feature.
            </p>
          </div>
        </section>

        <section id="ghost" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Info className="text-blue-400" /> Ghost Mode (Privacy-First)
          </h2>
          <p className="text-slate-400 leading-relaxed">
            For sensitive documents, enable <strong>Ghost Mode</strong> by
            passing{" "}
            <code className="text-blue-400 font-mono">"ghostMode": true</code>.
            The PDF will be generated, streamed to your webhook, and{" "}
            <strong>instantly deleted</strong> from our processing
            infrastructure.
          </p>

          <GlowCard
            title="Pricing & Tier Gating"
            sub="Pro & Enterprise Only"
            icon={<Info className="h-5 w-5 text-blue-400" />}
            content={
              <div className="space-y-4 mt-4 text-sm text-slate-400">
                <p>
                  Ghost Mode is exclusive to our <strong>Pro</strong> and{" "}
                  <strong>Enterprise</strong> plans. It is designed for
                  high-compliance environments where data must never touch
                  persistent storage.
                </p>
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                  <strong>Zero-Storage Guarantee:</strong> When Ghost Mode is
                  enabled, no records are stored in S3, and retention is set to
                  0 days.
                </div>
              </div>
            }
          />
          <GlowCard
            title="Compliance & Security"
            sub="Zero-Storage Policy"
            icon={<Info className="h-5 w-5 text-blue-400" />}
            content={
              <div className="space-y-2 mt-2 text-sm text-slate-400">
                <p>When Ghost Mode is enabled:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                  <li>S3 storage is bypassed completely.</li>
                  <li>Retention days are set to 0.</li>
                  <li>
                    Regeneration is unavailable (since the source HTML is not
                    stored).
                  </li>
                </ul>
              </div>
            }
          />
        </section>
        {/* Node.js SDK */}
        <section id="node-sdk" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Terminal className="text-blue-400" /> Node.js SDK
          </h2>
          <p className="text-slate-400 leading-relaxed">
            The official PDFBridge SDK for Node.js and TypeScript. Built with
            Zod runtime type-safety and performance in mind.
          </p>
          <CodeBlock
            code={`npm install @techhspyder/pdfbridge-node`}
            language="bash"
          />
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Quick Start</h4>
            <CodeBlock
              code={`import { PDFBridge } from '@techhspyder/pdfbridge-node';

// Automatically loads PDFBRIDGE_API_KEY from environment 
// or pass it explicitly: new PDFBridge({ apiKey: "..." })
const pdf = new PDFBridge();

async function run() {
  // Option 1: Generate & Wait for completion
  const result = await pdf.generateAndWait({
    url: 'https://example.com'
  });
  console.log('PDF URL:', result.pdfUrl);

  // Option 2: Ghost Mode (Renders as raw ArrayBuffer)
  const buffer = await pdf.generate({
    html: '<h1>Strictly Confidential</h1>',
    ghostMode: true
  });
}`}
              language="typescript"
            />
          </div>
        </section>

        {/* Python SDK */}
        <section id="python-sdk" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Terminal className="text-emerald-400" /> Python SDK
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Integrate PDFBridge into your Python applications with ease.
          </p>
          <CodeBlock code={`pip install pdfbridge-python`} language="bash" />
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Example Usage</h4>
            <CodeBlock
              code={`from pdfbridge import PDFBridge

# Automatically loads PDFBRIDGE_API_KEY from environment
client = PDFBridge()

# Generate and wait for completion
status = client.generate_and_wait(
    url="https://yourapp.com/invoice/123",
    options={"format": "A4", "printBackground": True}
)

print(f"PDF ready: {status.pdfUrl}")`}
              language="python"
            />
          </div>
        </section>
      </main>
    </div>
  );

  if (noContainer) return content;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full overflow-x-hidden">
      {content}
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={copy}
        className="absolute right-4 top-4 z-20 p-2 rounded-lg bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
      >
        {copied ? "Copied!" : <Terminal className="h-4 w-4" />}
      </button>
      <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} p-4 sm:p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm overflow-x-auto max-w-full text-xs sm:text-sm leading-relaxed`}
            style={{ ...style, backgroundColor: "transparent" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
