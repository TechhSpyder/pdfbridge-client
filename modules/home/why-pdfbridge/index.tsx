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
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Lightning Fast",
    description:
      "Our distributed worker architecture ensures your PDFs are generated and stored in the blink of an eye.",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    title: "Ghost Mode Security",
    description:
      "Pass `ghostMode: true` to bypass storage buckets entirely. The raw binary streams directly back to you for zero data retention.",
    icon: <ShieldCheck className="h-6 w-6" />,
  },
  {
    title: "Universal Rendering",
    description:
      "If a browser can see it, we can print it. Full support for modern CSS, JavaScript, and web fonts.",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    title: "AI Parsing & Templates",
    description:
      "Instantly extract structured JSON metadata from generated documents, or build dynamic Reusable Templates via natural language.",
    icon: <Bot className="h-6 w-6" />,
  },
  {
    title: "Proven Alternative",
    description:
      "Switching from PDFShift or other PDF APIs? See our honest comparison and migration guide.",
    icon: <ChartColumnStacked className="h-6 w-6" />,
  },
  {
    title: "Webhook Reliability",
    description:
      "Built-in webhook notifications with automatic exponential backoff ensure your systems stay in sync, even during downtime.",
    icon: <Activity className="h-6 w-6" />,
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
            Built for Modern Frontends
          </h2>
          <p className="mt-4 text-muted-foreground">
            Flexbox. CSS Grid. Tailwind. Web fonts. Print backgrounds. Precise
            page formatting. No fallback templates. Use your existing UI.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <GlowCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                content={
                  feature.title === "Proven Alternative" && (
                    <Link
                      href="/insights/pdfshift-alternative"
                      className="text-sm mt-3 underline font-medium"
                    >
                      Compare PDFBridge vs PDFShift →
                    </Link>
                  )
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
