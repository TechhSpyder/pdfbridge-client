import { Hero } from "@/modules/home/hero";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const SocialProof = dynamic(() =>
  import("@/modules/home/social-proof").then((mod) => mod.SocialProof),
);
const WhyPdfBridge = dynamic(() =>
  import("@/modules/home/why-pdfbridge").then((mod) => mod.WhyPdfBridge),
);
const HowItWorks = dynamic(() =>
  import("@/modules/home/how-it-works").then((mod) => mod.HowItWorks),
);
const BuiltForDevelopers = dynamic(() =>
  import("@/modules/home/built-for-developers").then((mod) => mod.BuiltForDevelopers),
);
const Pricing = dynamic(() =>
  import("@/modules/home/pricing").then((mod) => mod.Pricing),
);
const FAQ = dynamic(() => import("@/modules/home/faq").then((mod) => mod.FAQ));
const CTA = dynamic(() => import("@/modules/home/cta").then((mod) => mod.CTA));
const Footer = dynamic(() =>
  import("@/modules/home/footer").then((mod) => mod.Footer),
);
const Problem = dynamic(() =>
  import("@/modules/home/problem").then((mod) => mod.Problem),
);
const PuppeteerVs = dynamic(() =>
  import("@/modules/home/puppeteer-vs").then((mod) => mod.PuppeteerVs),
);

export const metadata: Metadata = {
  title: "PDFBridge — HTML to PDF API | Tailwind, React & AI Extraction",
  description:
    "Generate high-fidelity PDFs from HTML, URLs, and React components. 99.9% Uptime, lightning-fast rendering, and developer-first documentation.",
};

import { PublicPlaygroundWrapper as PublicPlayground } from "@/modules/home/hero/PublicPlaygroundWrapper";

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PDFBridge",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "description":
    "Generate high-fidelity PDFs from HTML, URLs, and React components. Tailwind-Native & AI-Powered.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "url": "https://pdfbridge.xyz",
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Hero />
      <div id="playground" className="w-full py-10">
        <PublicPlayground />
      </div>
      <SocialProof />
      <Problem />
      <WhyPdfBridge />
      <HowItWorks />
      <BuiltForDevelopers />
      <PuppeteerVs />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
