// app/privacy/page.tsx
"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/modules/app/button";

const Privacy: FC = () => {
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

      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-6">
        <strong>Last Updated:</strong> 19/02/2026
      </p>

      <p className="mb-4">
        PDFBridge is operated by <strong>Francis Bello</strong>, under the brand{" "}
        <strong>TechhSpyder</strong>. This Privacy Policy explains how I
        collect, use, and protect your data.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Data Collected</h2>
        <h3 className="font-medium">Personal Data</h3>
        <ul className="list-disc list-inside mb-2">
          <li>Name</li>
          <li>Email address</li>
          <li>Billing metadata (via third-party payment providers)</li>
        </ul>
        <h3 className="font-medium">Usage Data</h3>
        <ul className="list-disc list-inside mb-2">
          <li>IP address</li>
          <li>Device/browser info</li>
          <li>Feature usage</li>
        </ul>
        <h3 className="font-medium">Uploaded Files</h3>
        <ul className="list-disc list-inside">
          <li>Documents you submit for processing</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. How Your Data is Used</h2>
        <ul className="list-disc list-inside">
          <li>Provide and improve PDFBridge</li>
          <li>Process payments</li>
          <li>Communicate updates</li>
          <li>Prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. File Privacy</h2>
        <ul className="list-disc list-inside">
          <li>Files are processed solely to deliver the Service</li>
          <li>Temporary storage may occur (standard 7-day retention)</li>
          <li>
            <strong>Ghost Mode:</strong> If enabled, the file is instantly
            deleted after the rendering process and webhook delivery. No copy is
            retained in our storage systems.
          </li>
          <li>Files are never sold or manually reviewed</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Data Sharing</h2>
        <ul className="list-disc list-inside">
          <li>Payment providers</li>
          <li>Hosting providers</li>
          <li>Analytics tools</li>
          <li>Legal authorities when required</li>
        </ul>
        <p>
          I do <strong>not</strong> sell your data.
        </p>
        <p className="mt-2">
          Where PDFBridge processes personal data on behalf of customers, such
          processing is governed by our{" "}
          <Link href="/dpa" className="underline">
            Data Processing Agreement
          </Link>
          .
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Data Retention</h2>
        <ul className="list-disc list-inside">
          <li>
            <strong>Generated Files:</strong> Automatically purged from storage
            after 7 days. If Ghost Mode is active, deletion is instantaneous.
          </li>
          <li>
            <strong>Metadata & Webhook Logs:</strong> Retained for 45 days for
            billing, account history, and debugging purposes.
          </li>
          <li>
            <strong>Account Data:</strong> Retained as long as your account is
            active.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Security</h2>
        <p>Reasonable safeguards are in place, but no system is 100% secure.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
        <p>Depending on jurisdiction, you may request:</p>
        <ul className="list-disc list-inside">
          <li>Access</li>
          <li>Correction</li>
          <li>Deletion</li>
          <li>Restriction of processing</li>
        </ul>
        <p>
          Contact:{" "}
          <a href="mailto:privacy@techhspyder.com" className="underline">
            privacy@techhspyder.com
          </a>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Children</h2>
        <p>PDFBridge is not intended for users under 18.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Updates</h2>
        <p>Policy may be updated; continued use implies acceptance.</p>
      </section>

      <p className="mt-8">
        For more information, read our{" "}
        <Link href="/terms" className="underline">
          Terms and Conditions
        </Link>
        .
      </p>
    </main>
  );
};

export default Privacy;
