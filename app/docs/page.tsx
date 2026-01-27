import { Documentation } from "@/modules/docs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation",
  description:
    "Learn how to integrate PDFBridge into your application with our interactive API reference, snippets, and step-by-step guides.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 pt-24">
      {/* Header */}
      <div className="border-b border-white/5 bg-white/2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
            Developer <span className="text-blue-500">API</span>
          </h1>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl">
            Everything you need to build powerful PDF generation workflows into
            your application.
          </p>
        </div>
      </div>

      <Documentation />
    </div>
  );
}
