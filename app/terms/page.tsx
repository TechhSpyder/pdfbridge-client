// app/terms/page.tsx
"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
        <strong>Last Updated:</strong> 19/02/2026
      </p>

      <p className="mb-4">
        PDFBridge (“the Service”) is a software product operated by{" "}
        <strong>Francis Bello</strong> under the brand{" "}
        <strong>TechhSpyder</strong>.
      </p>

      <p className="mb-6">
        Until <strong>TechhSpyder Product Studio Limited</strong> is officially
        registered, all legal obligations, liabilities, and responsibilities
        relating to the Service remain with <strong>Francis Bello</strong>.
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
          <li>You are responsible for all activity under your account</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Subscriptions, Billing & Payments
        </h2>

        <h3 className="font-medium">Payments</h3>
        <p className="mb-2">
          Payments for PDFBridge are processed by <strong>Paddle.com</strong>,
          who acts as the <strong>Merchant of Record</strong>. Paddle handles
          payment processing, invoicing, taxes, refunds, and compliance with
          applicable consumer protection laws.
        </p>

        <p className="mb-4">
          PDFBridge does not store full payment credentials.
        </p>

        <h3 className="font-medium">Subscription Plans</h3>
        <p className="mb-2">
          PDFBridge offers monthly and yearly subscription plans. Prices,
          features, and limits are displayed on the Service and may change from
          time to time.
        </p>

        <p className="mb-4">
          Applicable taxes may be added depending on your location.
        </p>

        <h3 className="font-medium">Plan Changes</h3>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Upgrades:</strong> Take effect immediately and may be
            prorated.
          </li>
          <li>
            <strong>Downgrades:</strong> Take effect at the end of the current
            billing cycle.
          </li>
        </ul>

        <h3 className="font-medium">Cancellations</h3>
        <ul className="list-disc list-inside">
          <li>You may cancel at any time</li>
          <li>Future billing will stop upon cancellation</li>
          <li>
            Access remains available until the end of the current billing period
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Refund Policy</h2>
        <p className="mb-2">
          In accordance with Paddle’s Buyer Terms and applicable consumer
          protection laws, customers may request a refund within{" "}
          <strong>14 days of purchase</strong>.
        </p>
        <p className="mb-2">
          Refund requests must be submitted through Paddle or by contacting us
          at{" "}
          <a href="mailto:legal@techhspyder.com" className="underline">
            legal@techhspyder.com
          </a>
          .
        </p>
        <p>
          Refunds are processed by Paddle and returned to the original payment
          method. Refunds may be refused in cases of abuse, excessive usage, or
          violation of these Terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
        <ul className="list-disc list-inside">
          <li>
            All software, code, branding, and materials are owned by Francis
            Bello under TechhSpyder
          </li>
          <li>
            Users are granted a limited, non-exclusive, non-transferable, and
            revocable license
          </li>
          <li>Reverse engineering, resale, or redistribution is prohibited</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. User Files & Content</h2>
        <ul className="list-disc list-inside">
          <li>Users retain ownership of uploaded files and provided URLs</li>
          <li>Files are processed solely to provide the Service</li>
          <li>
            Users are solely responsible for ensures they have the legal right
            and authorization to capture or process the content of any URL
            provided to the Service.
          </li>
          <li>
            <strong>Rendering Fidelity:</strong> The Service may use standard
            browser emulation techniques (including User-Agent masking) to
            ensure high-fidelity rendering of responsive websites.
          </li>
          <li>
            <strong>Ghost Mode (Zero-Retention):</strong> When enabled via the
            API, the Service bypasses standard storage and instantly deletes the
            generated PDF after processing. Users are responsible for ensuring
            they capture the output via Webhook, as no copy will be available
            for regeneration.
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Data Processing</h2>
        <p>
          To the extent PDFBridge processes personal data on behalf of users as
          part of the Service, such processing is governed by our{" "}
          <Link href="/dpa" className="underline">
            Data Processing Agreement
          </Link>
          , which forms part of these Terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Service Availability</h2>
        <p>
          The Service is provided “as is” and “as available.” We do not
          guarantee uninterrupted uptime or error-free operation.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          9. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by law, liability is limited to the
          fees paid for the Service in the three months preceding the claim.
          This does not affect statutory consumer rights that cannot be
          excluded.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">10. Termination</h2>
        <p>
          Access may be suspended or terminated for violations of these Terms,
          non-payment, or legal compliance requirements. Outstanding fees remain
          payable.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">11. Governing Law</h2>
        <p>
          These Terms are governed by the laws of Nigeria, without limiting any
          mandatory consumer rights under applicable local laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">12. Contact</h2>
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
