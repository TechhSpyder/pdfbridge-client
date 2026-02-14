import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/modules/app/nav";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/modules/app/provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  metadataBase: new URL("https://pdfbridge.xyz"),
  title: {
    default: "PDFBridge | Modern API for PDF Generation",
    template: "%s | PDFBridge",
  },
  description:
    "Generate high-quality PDFs from URLs and HTML with a single API call. Scale your document infrastructure with ease.",
  keywords: [
    "pdf generation",
    "html to pdf",
    "url to pdf",
    "api",
    "gotenberg",
    "developer tools",
    "automated document generation",
  ],
  authors: [{ name: "PDFBridge Team" }],
  creator: "PDFBridge",
  publisher: "PDFBridge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "PDFBridge | Modern API for PDF Generation",
    description: "The developer's bridge to perfect PDFs.",
    url: "https://pdfbridge.xyz",
    siteName: "PDFBridge",
    images: [
      {
        url: "https://res.cloudinary.com/duv0exsir/image/upload/v1769535362/branded_og_image_pdfbridge_1769534994459_qn8iyg.jpg", // We should generate this later if it doesn't exist
        width: 1200,
        height: 630,
        alt: "PDFBridge - Modern PDF Generation API",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFBridge | Modern API for PDF Generation",
    description:
      "Generate high-quality PDFs from URLs and HTML with a single API call.",
    images: [
      "https://res.cloudinary.com/duv0exsir/image/upload/v1769535362/branded_og_image_pdfbridge_1769534994459_qn8iyg.jpg",
    ],
    creator: "@pdfbridge",
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

import { InactivityHandler } from "@/modules/auth/inactivity-handler";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} antialiased`}>
          <Script
            src="https://cdn.paddle.com/paddle/v2/paddle.js"
            strategy="afterInteractive"
          />
          <InactivityHandler />
          <Navbar />
          <Providers>{children}</Providers>
          <SpeedInsights />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
