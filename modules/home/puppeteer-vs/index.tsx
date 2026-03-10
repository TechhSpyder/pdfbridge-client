"use client";

import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";
import { XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const puppeteerPains = [
  "Browser lifecycle management",
  "Memory optimization",
  "Horizontal scaling",
  "Failure recovery",
  "Infrastructure monitoring",
  "Security hardening",
];

export function PuppeteerVs() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="border-t border-border py-24 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mx-auto max-w-2xl text-center mb-14 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Why Not Just Use Puppeteer?
          </h2>
          <p className="mt-4 text-muted-foreground">
            You can. But at scale, you&apos;ll manage a lot more than PDF
            generation.
          </p>
        </div>

        <div
          className={`grid md:grid-cols-2 gap-6 transition-all duration-700 delay-100 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Puppeteer column */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 space-y-4">
            <h3 className="text-lg font-semibold text-red-400">
              Self-Hosted Puppeteer
            </h3>
            <p className="text-sm text-muted-foreground">
              You&apos;ll also be managing:
            </p>
            <ul className="space-y-2">
              {puppeteerPains.map((pain) => (
                <li key={pain} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <XCircle className="h-4 w-4 shrink-0 text-red-500/70" />
                  {pain}
                </li>
              ))}
            </ul>
            <p className="pt-2 text-sm font-medium text-foreground/60 italic">
              That&apos;s not your product.<br />That&apos;s plumbing.
            </p>
          </div>

          {/* PDFBridge column */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">PDFBridge</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                PDFBridge abstracts the entire rendering layer. You send a URL
                or HTML. We handle the infrastructure, concurrency, retries, and
                security. You get back a PDF.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If it looks right in the browser, it looks right in the PDF.
              </p>
            </div>
            <Link
              href="/insights/puppeteer-pdf-alternative"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Deep dive: Puppeteer at scale <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
