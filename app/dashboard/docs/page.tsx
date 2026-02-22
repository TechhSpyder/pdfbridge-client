import { Documentation } from "@/modules/docs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation",
  description:
    "Learn how to integrate PDFBridge into your application with our interactive API reference, snippets, and step-by-step guides.",
};

export default function DashboardDocsPage() {
  return (
    <div className="relative space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          API <span className="text-blue-500">Documentation</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
          The comprehensive technical blueprint for your PDF infrastructure.
        </p>
      </div>

      <Documentation noContainer={true} />
    </div>
  );
}
