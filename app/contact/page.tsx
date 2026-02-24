import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Twitter } from "lucide-react";
import { GlowCard } from "@/modules/app/glow-card";
import { SmartContactLink } from "@/modules/app/smart-contact-link";
import { cn } from "@/utils";

export const metadata: Metadata = {
  title: "Contact Support",
  description:
    "Get in touch with the PDFBridge team for support, feedback, or enterprise inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-4 mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
            Contact <span className="text-blue-500">Support</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            We're here to help you bridge the gap between your code and perfect
            documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlowCard
            title="Email Support"
            sub="For technical help and billing"
            icon={<Mail className="h-6 w-6 text-blue-400" />}
            content={
              <div className="space-y-4 mt-4">
                <p className="text-sm text-slate-400">
                  Our engineering team monitors this inbox 24/7. Expect a
                  response within 4-12 hours.
                </p>
                <SmartContactLink
                  email="hello@techhspyder.com"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold text-sm tracking-wide transition-all hover:bg-blue-600/20"
                >
                  hello@techhspyder.com
                </SmartContactLink>
              </div>
            }
          />

          <GlowCard
            title="General Inquiries"
            sub="Feedback or partnership ideas"
            icon={<MessageSquare className="h-6 w-6 text-emerald-400" />}
            content={
              <div className="space-y-4 mt-4">
                <p className="text-sm text-slate-400">
                  Have a suggestion or want to chat about a custom enterprise
                  plan? We'd love to hear from you.
                </p>
                <SmartContactLink
                  email="hello@techhspyder.com"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm tracking-wide transition-all hover:bg-emerald-600/20"
                >
                  Send a Message
                </SmartContactLink>
              </div>
            }
          />

          <GlowCard
            title="Twitter / X"
            sub="Real-time updates & community"
            icon={<Twitter className="h-6 w-6 text-blue-300" />}
            content={
              <div className="space-y-4 mt-4">
                <p className="text-sm text-slate-400">
                  Follow us for the latest features, uptime alerts, and
                  developer tips.
                </p>
                <Link
                  href="https://x.com/TechhSpyder"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-wide transition-all hover:bg-white/10"
                >
                  @TechhSpyder
                </Link>
              </div>
            }
          />
        </div>

        {/* Knowledge Base CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-white/2 border border-white/5">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Need a quick answer?
              </h3>
              <p className="text-slate-400 text-sm">
                Check our documentation for API reference, n8n guides, and
                Tailwind-Native tutorials.
              </p>
            </div>
            <Link href="/docs">
              <Button className="bg-white text-black hover:bg-slate-200">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-xl px-6 text-sm font-bold tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
