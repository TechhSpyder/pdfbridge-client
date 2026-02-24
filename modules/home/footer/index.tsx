"use client";

import { Circle } from "lucide-react";
import Link from "next/link";
import { SmartContactLink } from "@/modules/app/smart-contact-link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="md:mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 grid-cols-2 md:grid-cols-4">
          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#features" className="hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-foreground">
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/insights" className="hover:text-foreground">
                  Journal & Insights
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-foreground">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/dpa" className="hover:text-foreground">
                  DPA
                </Link>
              </li>
            </ul>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-sm font-semibold">Status</h4>
            <a
              href="https://status.pdfbridge.xyz"
              target="_blank"
              className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Circle className="h-3 w-3 fill-green-500 text-green-500" />
              All systems operational
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <span>
            © {new Date().getFullYear()} PDFBridge. All rights reserved.
          </span>
          <div>
            <p>Owned and operated by TechhSpyder Product Studio Ltd.</p>
            <p>
              Contact:{" "}
              <Link
                href="/contact"
                className="hover:text-foreground font-semibold underline decoration-blue-500/30 underline-offset-4"
              >
                Support Desk
              </Link>
            </p>
          </div>
          <span>Built for developers.</span>
        </div>
      </div>
    </footer>
  );
}
