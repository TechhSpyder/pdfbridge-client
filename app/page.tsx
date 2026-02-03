import { Hero } from "@/modules/home";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const SocialProof = dynamic(() =>
  import("@/modules/home").then((mod) => mod.SocialProof),
);
const WhyPdfBridge = dynamic(() =>
  import("@/modules/home").then((mod) => mod.WhyPdfBridge),
);
const HowItWorks = dynamic(() =>
  import("@/modules/home").then((mod) => mod.HowItWorks),
);
const BuiltForDevelopers = dynamic(() =>
  import("@/modules/home").then((mod) => mod.BuiltForDevelopers),
);
const Pricing = dynamic(() =>
  import("@/modules/home").then((mod) => mod.Pricing),
);
const FAQ = dynamic(() => import("@/modules/home").then((mod) => mod.FAQ));
const CTA = dynamic(() => import("@/modules/home").then((mod) => mod.CTA));
const Footer = dynamic(() =>
  import("@/modules/home").then((mod) => mod.Footer),
);

export const metadata: Metadata = {
  title: "Modern PDF Generation API for Developers",
  description:
    "Generate high-fidelity PDFs from HTML, URLs, and React components. 99.9% Uptime, lightning-fast rendering, and developer-first documentation.",
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero />
      <SocialProof />
      <WhyPdfBridge />
      <HowItWorks />
      <BuiltForDevelopers />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
