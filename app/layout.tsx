import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/modules/app/nav";

import { Providers } from "@/modules/app/provider";
import { PostHogProvider } from "@/modules/app/posthog-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});
export const metadata: Metadata = {
  metadataBase: new URL("https://pdfbridge.xyz"),
  title: {
    default: "PDFBridge | Institutional Invoice Infrastructure",
    template: "%s | PDFBridge",
  },
  description:
    "High-fidelity invoice ingestion and reconciliation engine. Deterministic math audit and settlement orchestration for industrial document workflows.",
  keywords: [
    "invoice ingestion",
    "math audit",
    "settlement hub",
    "deterministic reconciliation",
    "ERP automation",
    "industrial document workflows",
    "financial data extraction",
    "compliance audit trail",
    "automated settlement",
    "ledger infrastructure",
  ],
  authors: [{ name: "PDFBridge Team" }],
  creator: "PDFBridge",
  publisher: "PDFBridge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PDFBridge | Institutional Invoice Infrastructure",
    description:
      "Deterministic invoice reconciliation and settlement orchestration. High-fidelity ingestion with automated math audit for industrial financial workflows.",
    url: "https://pdfbridge.xyz",
    siteName: "PDFBridge",
    images: [
      {
        url: "https://res.cloudinary.com/duv0exsir/image/upload/v1769535362/branded_og_image_pdfbridge_1769534994459_qn8iyg.jpg",
        width: 1200,
        height: 630,
        alt: "PDFBridge - Institutional Invoice Infrastructure",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFBridge | Institutional Invoice Infrastructure",
    description:
      "High-fidelity invoice ingestion and deterministic reconciliation engine for enterprise document workflows.",
    images: [
      "https://res.cloudinary.com/duv0exsir/image/upload/v1769535362/branded_og_image_pdfbridge_1769534994459_qn8iyg.jpg",
    ],
    creator: "@TechhSpyder",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased overflow-x-hidden w-full`}
      >
        <PostHogProvider>
          <Providers>
            <Navbar />
            {children}

            <SpeedInsights />
            <Analytics />
          </Providers>
        </PostHogProvider>
      </body>
    </html>
  );
}
