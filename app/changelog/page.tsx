import { Metadata } from "next";
import { Changelog } from "@/modules/changelog";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Recent updates and improvements to the PDFBridge platform.",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-4 mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
            Product <span className="text-blue-500">Changelog</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            A chronological timeline of how we're building the bridge between
            your code and perfect documents.
          </p>
        </div>

        <Changelog />

        {/* Footer CTA */}
        <div className="mt-24 p-8 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">
            Want to stay updated?
          </h3>
          <p className="text-slate-400 text-sm">
            Follow our founder on{" "}
            <Link
              href="https://x.com/pdfbridge"
              className="text-blue-400 hover:underline"
            >
              X (@pdfbridge)
            </Link>{" "}
            for real-time build updates.
          </p>
        </div>
      </div>
    </div>
  );
}
