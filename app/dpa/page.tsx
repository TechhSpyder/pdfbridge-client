// app/dpa/page.tsx
"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const DPA: FC = () => {
  const router = useRouter();

  return (
    <main className="max-w-4xl mx-auto p-6 text-slate-200">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-3 mb-4 text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="text-3xl font-bold mb-4">Data Processing Agreement</h1>
      <p className="mb-6">
        <strong>Last Updated:</strong> 19/02/2026
      </p>

      <p className="mb-6">
        This Data Processing Agreement (“<strong>DPA</strong>”) forms part of
        the Terms and Conditions and applies automatically when you create an
        account or use PDFBridge.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Roles of the Parties</h2>
        <p>
          Where PDFBridge processes personal data on behalf of a customer in
          connection with uploaded documents or generated outputs:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>
            The customer acts as the <strong>Data Controller</strong>
          </li>
          <li>
            PDFBridge (operated by TechhSpyder) acts as the{" "}
            <strong>Data Processor</strong>
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Scope of Processing</h2>
        <p>
          PDFBridge processes personal data solely for the purpose of providing
          the Service, including:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Generating, transforming, and delivering PDF documents</li>
          <li>Temporary storage required for processing</li>
          <li>Service operation, security, and reliability</li>
          <li>
            <strong>Zero-Retention Processing (Ghost Mode):</strong> Where
            requested by the customer, personal data in generated outputs is
            processed without persistent storage, ensuring immediate deletion
            post-delivery.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Customer Obligations</h2>
        <p>
          Customers confirm that they have the necessary rights and lawful basis
          to upload and process any personal data using the Service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. PDFBridge Obligations</h2>
        <ul className="list-disc list-inside">
          <li>
            Process personal data only on documented customer instructions
          </li>
          <li>Ensure confidentiality of personnel with access to data</li>
          <li>
            Implement appropriate technical and organizational security measures
          </li>
          <li>
            Not access, use, or disclose customer content except as required to
            provide the Service
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Sub-processors</h2>
        <p>
          PDFBridge uses trusted sub-processors to deliver the Service,
          including infrastructure, storage, and payment providers.
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Cloudflare (CDN, storage, security)</li>
          <li>Neon (database hosting)</li>
          <li>Render (application hosting)</li>
          <li>Redis (caching and queues)</li>
          <li>Paystack and Paddle (payment processing)</li>
          <li>Google (AI metadata extraction)</li>
        </ul>
        <p className="mt-2">
          Sub-processors are subject to contractual obligations consistent with
          this DPA.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Data Subject Rights</h2>
        <p>
          PDFBridge will reasonably assist customers in responding to requests
          from data subjects where required under applicable data protection
          laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          7. Security & Data Breaches
        </h2>
        <p>
          PDFBridge implements reasonable safeguards to protect personal data
          and will notify customers without undue delay in the event of a
          personal data breach affecting customer data.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Data Deletion</h2>
        <p>
          Upon termination of the Service or at the customer’s request,
          PDFBridge will delete or return personal data in accordance with its
          retention practices and applicable laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          9. International Transfers
        </h2>
        <p>
          Where personal data is transferred outside the customer’s
          jurisdiction, appropriate safeguards are applied in accordance with
          applicable data protection laws.
        </p>
      </section>

      <p className="mt-8">
        This DPA should be read together with our{" "}
        <Link href="/terms" className="underline">
          Terms and Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </main>
  );
};

export default DPA;
