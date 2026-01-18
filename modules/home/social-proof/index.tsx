"use client";

import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";
import {
  Banknote,
  ShoppingCart,
  BarChart3,
  Scale,
  Briefcase,
  FileText,
} from "lucide-react";

const industries = [
  {
    title: "Fintech",
    description: "Statements, receipts, compliance reports",
    icon: Banknote,
  },
  {
    title: "SaaS",
    description: "Analytics dashboards, user reports",
    icon: BarChart3,
  },
  {
    title: "E-commerce",
    description: "Invoices, order summaries",
    icon: ShoppingCart,
  },
  {
    title: "Legal & Compliance",
    description: "Filings, contracts, audits",
    icon: Scale,
  },
  {
    title: "Agencies & Ops",
    description: "Client-ready exports",
    icon: Briefcase,
  },
  {
    title: "Internal Tools",
    description: "Automated exports from private dashboards",
    icon: FileText,
  },
];

export function SocialProof() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="border-t border-border bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Built for teams across industries
          </h2>
          <p className="mt-4 text-muted-foreground">
            Designed to support high-volume, automated PDF generation across
            modern workflows.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((item, index) => (
            <div
              key={item.title}
              className={`rounded-2xl border border-border bg-background p-6 transition-all duration-700 ease-out ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{
                transitionDelay: `${index * 80}ms`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted">
                  <item.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Micro trust line */}
        <p
          className={`mt-10 text-center text-sm text-muted-foreground transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          Built for production-grade reliability, scalability, and consistent
          HTML-to-PDF rendering.
        </p>
      </div>
    </section>
  );
}
