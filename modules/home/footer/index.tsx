"use client";

import { Circle } from "lucide-react";

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
                <a href="/features" className="hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/docs" className="hover:text-foreground">
                  API
                </a>
              </li>
              <li>
                <a href="/security" className="hover:text-foreground">
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/about" className="hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-foreground">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-foreground">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/dpa" className="hover:text-foreground">
                  DPA
                </a>
              </li>
            </ul>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-sm font-semibold">Status</h4>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Circle className="h-3 w-3 fill-green-500 text-green-500" />
              All systems operational
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <span>
            © {new Date().getFullYear()} PDFBridge. All rights reserved.
          </span>
          <span>Built for developers.</span>
        </div>
      </div>
    </footer>
  );
}
