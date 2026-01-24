import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/modules/app/nav";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/modules/app/provider";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "PDFBridge | Modern API for PDF Generation",
  description:
    "Generate high-quality PDFs from URLs and HTML with a single API call. Scale your document infrastructure with ease.",
  keywords: [
    "pdf generation",
    "html to pdf",
    "api",
    "gotenberg",
    "developer tools",
  ],
  openGraph: {
    title: "PDFBridge",
    description: "The developer's bridge to perfect PDFs.",
    url: "https://pdfbridge.xyz",
    siteName: "PDFBridge",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} antialiased`}>
          <Navbar />
          <Providers>{children}</Providers>
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
