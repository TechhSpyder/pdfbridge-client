"use client";

import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";

export function CTA() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-border py-24"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          className={`text-4xl font-semibold tracking-tight transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Ready to automate your document workflow?
        </h2>

        <p
          className={`mt-4 text-lg text-muted-foreground transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Join thousands of developers building the future of digital documents.
        </p>

        {/* CTA Button */}
        <div
          className={`mt-10 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <a
            href="/signup"
            className="relative inline-flex items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-lg font-medium text-white shadow-lg transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-background animate-pulse"
          >
            Build Your First PDF Now
          </a>
        </div>
      </div>
    </section>
  );
}
