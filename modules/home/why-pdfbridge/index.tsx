"use client";

import { GlowCard } from "@/modules/app/glow-card";
import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";
import {
  Zap,
  ShieldCheck,
  Globe,
  ChartColumnStacked,
  Bot,
  Activity,
  Database,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Distributed Worker Architecture",
    description:
      "Horizontally scalable worker fleet designed for high-throughput document workflows.",
    icon: <Zap className="h-6 w-6" />,
    content: (
      <div className="mt-4 space-y-2">
        <p className="text-sm text-muted-foreground font-medium">Built for:</p>
        <ul className="space-y-1">
          {[
            "automatic horizontal scaling",
            "zero-queue generation",
            "multi-region availability",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-blue-400">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    title: "Ghost Mode Security",
    description: "Bypass storage buckets entirely for zero data retention.",
    icon: <ShieldCheck className="h-6 w-6" />,
    content: (
      <div className="mt-4 space-y-2">
        <p className="text-sm text-muted-foreground font-medium">Standards:</p>
        <ul className="space-y-1">
          {[
            "raw binary streaming",
            "No files written to disk",
            "No persistent logs",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-blue-400">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    title: "Document Data Layer",
    description: "Every processed document is indexed and queryable.",
    icon: <Database className="h-6 w-6" />,
    content: (
      <div className="mt-4 space-y-2">
        <p className="text-sm text-muted-foreground font-medium">Use it to:</p>
        <ul className="space-y-1">
          {[
            "retrieve structured data",
            "power reconciliation workflows",
            "sync into your ERP or accounting system",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-blue-400">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    title: "Verified Extraction",
    description:
      "High-accuracy extraction with built-in validation checks for totals, line items, and vendor consistency.",
    icon: <Bot className="h-6 w-6" />,
    content: (
      <div className="mt-4 space-y-2">
        <p className="text-sm text-muted-foreground font-medium">Includes:</p>
        <ul className="space-y-1">
          {[
            "vendor consistency checks",
            "line item math validation",
            "total amount verification",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-blue-400">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    title: "Proven Alternative",
    description: "Switching from PDFShift or other legacy APIs?",
    icon: <ChartColumnStacked className="h-6 w-6" />,
    content: (
      <div className="mt-4 space-y-2">
        <p className="text-sm text-muted-foreground font-medium">Migration:</p>
        <ul className="space-y-1 mb-3">
          {[
            "simplified migration path",
            "technical comparison guide",
            "cost-to-value analysis",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-blue-400">•</span>
              {item}
            </li>
          ))}
        </ul>
        <Link
          href="/insights/pdfshift-alternative"
          className="text-sm underline font-medium"
        >
          Compare PDFBridge vs PDFShift →
        </Link>
      </div>
    ),
  },
  {
    title: "Webhook Reliability",
    description: "Stay in sync even during downstream downtime.",
    icon: <Activity className="h-6 w-6" />,
    content: (
      <div className="mt-4 space-y-2">
        <p className="text-sm text-muted-foreground font-medium">
          Orchestration:
        </p>
        <ul className="space-y-1">
          {[
            "automatic retry logic",
            "signed payload security",
            "delivery status tracking",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-blue-400">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];

export function WhyPdfBridge() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="features" ref={ref} className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Financial documents shouldn&apos;t be static files.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            They should be structured, validated, and usable inside your systems.
          </p>
        </div>

        {/* Pipeline Section */}
        <div className="mt-16 bg-slate-900/40 rounded-[40px] border border-white/5 p-8 md:p-12">
          <h3 className="text-xl font-bold text-white mb-10 text-center uppercase tracking-widest text-blue-400">
            A complete financial document pipeline
          </h3>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative">
            {[
              {
                title: "Extract",
                description: "Structured data from complex financial documents.",
                icon: <Zap className="h-6 w-6" />,
                details: ["High-accuracy extraction for financial documents", "Multi-page orchestration"]
              },
              {
                title: "Validate",
                description: "Ensure totals, line items, and vendor consistency.",
                icon: <ShieldCheck className="h-6 w-6" />,
                details: ["Extraction without validation is unreliable.", "Financial-grade verification"]
              },
              {
                title: "Normalize",
                description: "Standardize into clean, system-ready formats.",
                icon: <Activity className="h-6 w-6" />,
                details: ["Data type enforcement", "Cross-system consistency"]
              },
              {
                title: "Sync",
                description: "Deliver directly into your systems via API or webhooks.",
                icon: <Database className="h-6 w-6" />,
                details: ["Sync to ERPs and accounting systems", "Automated reconciliation"]
              }
            ].map((step, index) => (
              <div key={step.title} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    {step.icon}
                  </div>
                  <h4 className="text-lg font-bold text-white">{step.title}</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  {step.description}
                </p>
                <div className="space-y-1">
                  {step.details.map((detail) => (
                    <p key={detail} className="text-[11px] text-slate-500 italic flex items-start gap-2">
                       <span className="text-blue-500/50">•</span> {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid (Secondary for Layer/Output) */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {[
            {
              title: "A financial document data layer",
              description: "Every document becomes structured, queryable, and reusable infrastructure.",
              icon: <Bot className="h-6 w-6" />,
              details: ["Structured Data retrieval", "Audit trail generation", "Zero infrastructure overhead"]
            },
            {
              title: "System-Ready Output",
              description: "High-fidelity results formatted for ingestion and archival.",
              icon: <Globe className="h-6 w-6" />,
              details: ["Structured JSON (Primary)", "Normalized output (PDF/HTML)"]
            }
          ].map((feature, index) => (
            <div
              key={feature.title}
              className={`transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <GlowCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                content={
                  <div className="mt-4 space-y-2">
                    <ul className="space-y-1">
                      {feature.details.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-muted-foreground font-medium">
                          <span className="text-blue-400 font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
