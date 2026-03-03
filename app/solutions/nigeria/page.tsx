import { Metadata } from "next";
import Link from "next/link";
import { Globe, CreditCard, Banknote, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "HTML to PDF API in Nigeria | Pay in NGN with Paystack | PDFBridge",
  description:
    "The first reliable HTML to PDF API tailored for Nigerian and African developers. Pay your API subscription directly in Naira (NGN) via Paystack.",
  keywords: [
    "NGN PDF API",
    "pay for pdf api in naira",
    "paystack pdf api",
    "flutterwave pdf api",
    "html to pdf nigeria",
    "techpoint africa developers",
    "pdf generation api africa"
  ],
  alternates: {
    canonical: "https://pdfbridge.xyz/solutions/nigeria",
  },
};

export default function NigerianPricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Hero */}
      <header className="pt-32 pb-16 px-6 max-w-4xl mx-auto text-center relative z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-black uppercase tracking-widest mb-8">
          <Globe size={16} /> Localized Billing
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
          PDF Generation API. <br />
          <span className="text-green-400/90 tracking-normal">Built for African Teams.</span>
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-10">
          Tired of FX limits, virtual dollar card failures, and expensive exchange rates? PDFBridge is the first developer-focused PDF infrastructure that accepts native Naira (₦) payments via Paystack.
        </p>
        
        <Link href="/sign-up" className="inline-block px-10 py-5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all shadow-xl shadow-green-500/20">
          Create Free Account
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 text-center">
            <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <Banknote className="text-green-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">Pay in NGN</h3>
            <p className="text-slate-400 text-sm">Say goodbye to unpredictable billing. Subscribe to our Pro and Business plans using localized pricing in Naira without worrying about CBN card caps.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 text-center">
            <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CreditCard className="text-green-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">Paystack Integration</h3>
            <p className="text-slate-400 text-sm">We process our African billing natively through Paystack. Smooth, instant, and fully compliant.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 text-center">
            <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="text-green-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">World-class Tech</h3>
            <p className="text-slate-400 text-sm">You get exactly the same massive infrastructure: AI Extraction tools, Template engines, and React endpoints as global users.</p>
          </div>
        </div>

        <section className="mt-24 p-12 rounded-3xl bg-slate-900/50 border border-white/5">
           <h2 className="text-3xl font-black mb-6">Perfect for Local Innovators</h2>
           <p className="text-slate-400 leading-relaxed mb-6">
             Whether you are a fintech startup generating dynamic transaction receipts in Lagos, or a logistics company dispatching waybills across the continent, document automation is critical. 
             Don't let payment gateway friction block your engineering progress. PDFBridge enables you to scale indefinitely.
           </p>
        </section>
      </main>
    </div>
  );
}
