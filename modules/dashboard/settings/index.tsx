"use client";

import { useUser, UserProfile } from "@clerk/nextjs";
import { useMe } from "@/modules/hooks/queries";
import { GlowCard } from "@/modules/app/glow-card";
import { Button } from "@/modules/app/button";
import {
  Settings,
  CreditCard,
  User as UserIcon,
  ChevronRight,
  Zap,
  Check,
} from "lucide-react";
import Link from "next/link";

export function SettingsPage() {
  const { data: userData } = useMe();

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="h-8 w-8 text-slate-400" />
          Settings & Billing
        </h1>
        <p className="mt-1 text-slate-400 text-sm">
          Manage your account security, profile, and subscription preferences.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          {/* Billing Section */}
          <GlowCard
            title="Subscription Plan"
            sub="Current Billing Cycle"
            icon={<CreditCard className="h-5 w-5 text-blue-500" />}
            content={
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-600/5 border border-blue-500/10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">
                        {userData?.plan?.name || "Standard Free"}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Up to {userData?.plan?.limit || 5} conversions / month
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                      ACTIVE
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Plan Highlights
                  </p>
                  <ul className="grid grid-cols-2 gap-2">
                    {[
                      "Global Edge Network",
                      "Secure Storage",
                      "High Latency Protection",
                      "API Access",
                    ].map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center gap-2 text-xs text-slate-400"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <Link href="/dashboard/billing">
                    <Button className="w-full bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/10 transition-all active:scale-95">
                      Upgrade or Manage Plan
                    </Button>
                  </Link>
                </div>
              </div>
            }
          />

          {/* Personal Info via Clerk */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800/50">
                <UserIcon className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Identity & Security
              </h3>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-900/40 overflow-hidden shadow-2xl overflow-y-auto max-h-[1200px]">
              <UserProfile
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none border-none p-0 w-full",
                    navbar: "hidden",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    scrollBox: "bg-transparent",
                    pageScrollBox: "p-0",
                    userButtonPopoverCard:
                      "bg-slate-900 border border-white/10",
                    profileSectionTitleText: "text-white text-sm font-bold",
                    profileSectionPrimaryButton:
                      "text-blue-400 hover:text-blue-300",
                    userButtonBlockButtonText: "text-white",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-500",
                    formFieldInput:
                      "bg-black/40 border-white/10 text-white focus:border-blue-500 transition-colors",
                    formFieldLabel: "text-slate-400 text-xs",
                    footer: "hidden",
                    profileSection:
                      "px-6 py-6 border-b border-white/5 last:border-0",
                    accordionTriggerButton: "text-white hover:bg-white/5",
                    breadcrumbs: "hidden",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 space-y-4 shadow-xl">
            <h4 className="font-bold text-white text-sm">Trust & Security</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your data is encrypted and stored securely (AES-256). We follow
              industry best practices for data protection and privacy.
            </p>
            <div className="pt-4 flex flex-col gap-3">
              <button className="text-left text-xs text-blue-400 hover:text-blue-300 flex items-center justify-between group">
                Security Documentation
                <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="text-left text-xs text-blue-400 hover:text-blue-300 flex items-center justify-between group">
                Privacy Policy
                <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-red-500/10 bg-red-500/5 space-y-4 shadow-xl">
            <h4 className="font-bold text-red-400 text-sm">Danger Zone</h4>
            <p className="text-xs text-red-500/50 leading-relaxed">
              Deactivating your account will immediately stop all PDF
              conversions and delete all your API keys permanently.
            </p>
            <Button
              variant="outline"
              className="w-full text-xs h-9 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
            >
              Deactivate Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
