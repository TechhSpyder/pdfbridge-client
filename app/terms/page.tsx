// app/terms/page.tsx
"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/modules/app/button";

const Terms: FC = () => {
  const router = useRouter();

  return (
    <main className="max-w-4xl mx-auto p-6 text-slate-200">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-3 mb-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors font-medium duration-200 ease-out"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <p className="mb-6">
        <strong>Last Updated:</strong> 26/01/2026
      </p>

      <p className="mb-4">
        PDFBridge (“the Service”) is a product operated by{" "}
        <strong>Francis Bello</strong> under the brand{" "}
        <strong>TechhSpyder</strong>.
      </p>
      <p className="mb-6">
        ⚠️ Until TechhSpyder Product Studio Limited is officially registered,
        all legal obligations, liabilities, and responsibilities remain with{" "}
        <strong>Francis Bello</strong> personally.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Eligibility</h2>
        <ul className="list-disc list-inside">
          <li>You must be 18 years or older</li>
          <li>You must be legally capable of entering binding contracts</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          2. Account Responsibility
        </h2>
        <ul className="list-disc list-inside">
          <li>Maintain accurate account information</li>
          <li>Secure your login credentials</li>
          <li>All activity under your account</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Subscriptions & Billing
        </h2>

        <h3 className="font-medium">Subscription Plans</h3>
        <p>
          PDFBridge offers monthly and yearly plans. Prices, features, and
          limits are displayed on the Service. Taxes may apply depending on your
          location.
        </p>
        <p>
          Payments are processed by third-party providers (Stripe, Paystack). I
          do <strong>not</strong> store full payment credentials.
        </p>

        <h3 className="font-medium mt-2">Plan Changes</h3>
        <ul className="list-disc list-inside mb-2">
          <li>
            <strong>Upgrades:</strong> Take effect immediately. Charges are
            prorated.
          </li>
          <li>
            <strong>Downgrades:</strong> Take effect at the end of the billing
            cycle. No refunds or credits for unused time.
          </li>
        </ul>

        <h3 className="font-medium mt-2">Cancellations</h3>
        <ul className="list-disc list-inside mb-2">
          <li>
            Cancel anytime; stops future billing but past payments are not
            refunded
          </li>
          <li>Access remains until billing period ends</li>
        </ul>

        <h3 className="font-medium mt-2">Failed Payments & Chargebacks</h3>
        <ul className="list-disc list-inside">
          <li>Access may be restricted if payment fails</li>
          <li>
            Unauthorized chargebacks may result in suspension or termination
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
        <ul className="list-disc list-inside">
          <li>
            All PDFBridge software, branding, code, and materials are owned by
            Francis Bello under TechhSpyder
          </li>
          <li>Users have a limited, revocable, non-transferable license</li>
          <li>Reverse engineering, resale, or redistribution is prohibited</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. User Files & Content</h2>
        <ul className="list-disc list-inside">
          <li>Users retain ownership of uploaded files</li>
          <li>Files are processed solely to deliver the Service</li>
          <li>
            Users are responsible for having legal rights to uploaded content
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Service Availability</h2>
        <p>
          Provided “as is” and “as available.” No guarantee of uninterrupted
          uptime or error-free performance.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          7. Limitation of Liability
        </h2>
        <p>
          Maximum liability is limited to fees paid in the last 3 months. I
          shall not be liable for indirect, incidental, or consequential
          damages.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Termination</h2>
        <p>
          Access may be suspended or terminated for violations, non-payment, or
          legal compliance. Outstanding fees remain payable.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Governing Law</h2>
        <p>These Terms are governed by the laws of Nigeria.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">10. Contact</h2>
        <p>
          Email:{" "}
          <a href="mailto:legal@techhspyder.com" className="underline">
            legal@techhspyder.com
          </a>
        </p>
      </section>

      <p className="mt-8">
        For more information, read our{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </main>
  );
};

export default Terms;
