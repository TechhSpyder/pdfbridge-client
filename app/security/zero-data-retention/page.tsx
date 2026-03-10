import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Trash2, FileText, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Zero Data Retention PDF API | Ghost Mode | PDFBridge",
  description:
    "Secure HTML to PDF API with strict zero data retention. Ghost Mode processes PDFs entirely in RAM—no disk storage, no logs. Perfect for Fintech & Healthcare.",
  keywords: [
    "zero data retention pdf api",
    "secure html to pdf",
    "hipaa compliant pdf generation",
    "ghost mode pdf api",
    "pdfbridge privacy",
    "secure document generation api",
  ],
  alternates: {
    canonical: "https://pdfbridge.xyz/security/zero-data-retention",
  },
  openGraph: {
    title: "Zero Data Retention PDF API | Ghost Mode",
    description: "Generate PDFs in complete privacy. RAM-only processing without disk caching.",
    url: "https://pdfbridge.xyz/security/zero-data-retention",
    type: "website",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PDFBridge Ghost Mode",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "Any",
  "description": "A high-security PDF generation API featuring Zero Data Retention. Ideal for generating sensitive invoices, medical records, and legal contracts.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "15"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Security Lead at Fintech Platform"
      },
      "reviewBody": "The stateless architecture and Ghost Mode are essential for our PCI compliance."
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Zero Data Retention in PDF generation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Zero Data Retention means your raw HTML payload and the resulting PDF are never stored on our permanent storage drives. The entire conversion happens in volatile RAM and is immediately purged post-delivery."
      }
    },
    {
      "@type": "Question",
      "name": "Is PDFBridge suitable for HIPAA or GDPR compliance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Ghost Mode ensures no PII (Personally Identifiable Information) is cached, logged, or retained, greatly simplifying your compliance with GDPR, HIPAA, and SOC2 requirements."
      }
    }
  ]
};

export default function ZeroDataRetentionPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      {/* Header section */}
      <header className="pt-32 pb-16 px-6 max-w-4xl mx-auto text-center relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-8">
          <ShieldCheck size={16} /> Enterprise Security Standard
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
          Zero Data Retention <br />
          <span className="bg-linear-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">PDF Generation</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
          Protect sensitive Fintech transactions, Healthcare records, and Legal documents with <strong>Ghost Mode.</strong> The only HTML to PDF API that processes strictly in volatile RAM.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6 grid gap-16 relative z-10">
        
        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900 border border-white/5">
            <Trash2 className="w-10 h-10 text-emerald-500 mb-6" />
            <h3 className="text-xl font-bold mb-4">No Disk Caching</h3>
            <p className="text-slate-400">Payloads and output PDFs are kept in isolated RAM. Once the API response is complete, memory is instantly freed. No orphan files left behind.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900 border border-white/5">
            <Lock className="w-10 h-10 text-emerald-500 mb-6" />
            <h3 className="text-xl font-bold mb-4">End-to-End Encryption</h3>
            <p className="text-slate-400">All data is encrypted in transit over TLS 1.3. We act only as a blind conduit between your application's input and your requested output.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900 border border-white/5">
            <FileText className="w-10 h-10 text-emerald-500 mb-6" />
            <h3 className="text-xl font-bold mb-4">Compliance Native</h3>
            <p className="text-slate-400">Easily pass security audits. By proving PDFBridge does not retain your data, you avoid opening up a third-party risk vector under GDPR or SOC2.</p>
          </div>
        </div>

        {/* Deep Dive Content Section */}
        <article className="prose prose-invert prose-emerald prose-lg max-w-none">
          <h2>Why Standard PDF APIs Are a Security Risk</h2>
          <p>
            Most legacy document APIs function by receiving your HTML payload, saving it to a temporary `/tmp` drive, spinning up a headless browser, generating the PDF, saving the PDF to a static S3 bucket, and returning a hosted URL.
          </p>
          <p>
            <strong>This process leaves dangerous artifacts across multiple systems.</strong> For healthcare companies handling PHI or financial institutions handling bank statements, these artifacts are an unacceptable compliance violation.
          </p>
          <h2>How Ghost Mode Works</h2>
          <p>
            When you pass the <code>"ghost_mode": true</code> flag in your PDFBridge API request, our infrastructure shifts into pure-volatile execution. We bypass traditional filesystem I/O operations and route your payload through sandboxed, single-use V8 isolates. The PDF byte stream is piped directly to your server and instantly cleared from our server's memory.
          </p>
        </article>

        {/* CTA */}
        <div className="p-10 rounded-3xl bg-emerald-900/20 border border-emerald-500/30 text-center pattern-grid-lg">
          <h2 className="text-3xl font-black mb-6">Start Generating Secure PDFs</h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-xl mx-auto">
            Integrate the security-first PDF generation API into your application today. Clear your compliance hurdles effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/sign-up" className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2">
              Start Building Securely <ArrowRight size={18} />
            </Link>
            <Link href="/docs#ghost" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all">
              Read Security Docs
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
