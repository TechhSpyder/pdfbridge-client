"use client";

import {
  useMe,
  useApprovalPolicy,
  useUpdateApprovalPolicy,
} from "@/modules/hooks/queries";
import {
  Button,
  GlowCard,
  SmartContactLink,
  UserAvatar,
  Dialog,
} from "@/modules/app";
import {
  Settings,
  CreditCard,
  User as UserIcon,
  ChevronRight,
  Zap,
  Check,
  Bell,
  Mail,
  Network,
  Webhook,
  Unplug,
  Loader2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useUpdateSettings,
  useIntegrations,
  useDisconnectIntegration,
  usePDFBridge,
  useDeactivateAccount,
} from "@/modules/hooks/queries";
import { toast } from "sonner";
import Title from "@/modules/app/title";
import { authClient, useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { IntegrationsTab } from "./index/integrations-tab";
import { WebhooksTab } from "./index/webhooks-tab";
import { DeactivateAccountDialog } from "./index/deactivation-dialog";
import { ProfileForm, WorkspaceForm } from "./index/forms";
import { Governance } from "./index/governance";

export function SettingsPage() {
  const { data: userData, isLoading: userLoading } = useMe();
  const userRole = (userData as any)?.role as string | undefined;
  const orgId = (userData as any)?.organizationId as string | undefined;
  const isOwner = userRole === "OWNER";
  const { data: policyData } = useApprovalPolicy(orgId);
  const policy = (policyData as any)?.data;
  const updatePolicy = useUpdateApprovalPolicy(orgId);
  const [policySignificant, setPolicySignificant] = useState<string>(
    String(policy?.significant ?? policy?.planDefaults?.significant ?? 1000),
  );
  const [policyMaterial, setPolicyMaterial] = useState<string>(
    String(policy?.material ?? policy?.planDefaults?.material ?? 10000),
  );
  const { data: session } = useSession();
  const updateSettingsMutation = useUpdateSettings();
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  const handleToggle = async (key: string, value: boolean) => {
    try {
      await updateSettingsMutation.mutateAsync({ [key]: value });
      toast.success("Preferences updated");
    } catch (e: any) {
      toast.error("Failed to update preferences", {
        description: e.message || "Please check your network and try again.",
      });
    }
  };

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "general";

  // Handle OAuth callbacks success/errors
  useEffect(() => {
    const successParam = searchParams.get("success");
    const errorParam = searchParams.get("error");

    if (successParam === "xero") {
      toast.success("Successfully connected to Xero!");
      router.replace("/dashboard/settings?tab=integrations", { scroll: false });
    }
    if (successParam === "quickbooks") {
      toast.success("Successfully connected to QuickBooks!");
      router.replace("/dashboard/settings?tab=integrations", { scroll: false });
    }
    if (errorParam) {
      toast.error("Integration Error", { description: errorParam });
      router.replace("/dashboard/settings?tab=integrations", { scroll: false });
    }
  }, [searchParams, router]);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <Title
        title="Settings & Billing"
        description="Manage your account security, profile, and subscription preferences."
        icon={<Settings className="h-8 w-8 text-slate-400" />}
      />

      <div className="flex space-x-1 border-b border-white/10 mb-8">
        <button
          onClick={() => router.push("/dashboard/settings?tab=general")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 ${
            currentTab === "general"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <Settings className="w-4 h-4" />
          General
        </button>
        <button
          onClick={() => router.push("/dashboard/settings?tab=integrations")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 ${
            currentTab === "integrations"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <Network className="w-4 h-4" />
          Integrations
        </button>
        <button
          onClick={() => router.push("/dashboard/settings?tab=webhooks")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 ${
            currentTab === "webhooks"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <Webhook className="w-4 h-4" />
          Developer Webhooks
        </button>
        {/* Governance tab: OWNER + ADMIN can see, OWNER can edit */}
        {(userRole === "OWNER" || userRole === "ADMIN") && (
          <button
            onClick={() => router.push("/dashboard/settings?tab=governance")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 ${
              currentTab === "governance"
                ? "border-violet-500 text-violet-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Governance Policy
          </button>
        )}
      </div>

      {currentTab === "general" ? (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="lg:col-span-2 space-y-12">
            {/* Billing Section */}
            <div className="flex w-full gap-8 lg:flex-row flex-col">
              <GlowCard
                title="Subscription Plan"
                sub="Current Billing Cycle"
                icon={<CreditCard className="h-5 w-5 text-blue-500" />}
                className="h-fit lg:w-[65%] w-full"
                content={
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-blue-600/5 border border-blue-500/10">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                          <Zap className="h-6 w-6" />
                        </div>
                        {userLoading ? (
                          <div className="flex flex-col gap-2 animate-pulse">
                            <div className="h-6 w-12! rounded-full skeleton-el" />
                            <div className="h-5 w-28! rounded-full skeleton-el" />
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-bold text-white text-lg">
                              {userData?.plan?.name || "Standard Free"}
                            </h4>
                            <p className="text-xs text-slate-400">
                              Up to {userData?.plan?.limit || 5} processed
                              documents / month
                            </p>
                          </div>
                        )}
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
              {/* Side Panel */}
              <div className="space-y-6 h-fit flex-1">
                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 space-y-4 shadow-xl">
                  <h4 className="font-bold text-white text-sm">
                    Trust & Security
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your data is encrypted and stored securely (AES-256). We
                    follow industry best practices for data protection and
                    privacy.
                  </p>
                  <div className="pt-4 flex flex-col gap-3">
                    <Link
                      href="/terms"
                      className="text-left text-xs text-blue-400 hover:text-blue-300 flex items-center justify-between group cursor-pointer"
                    >
                      Terms of Service
                      <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/privacy"
                      className="text-left text-xs text-blue-400 hover:text-blue-300 flex items-center justify-between group cursor-pointer"
                    >
                      Privacy Policy
                      <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-red-500/10 bg-red-500/5 space-y-4 shadow-xl">
                  <h4 className="font-bold text-red-400 text-sm">
                    Danger Zone
                  </h4>
                  <p className="text-xs text-red-500/50 leading-relaxed">
                    Deactivating your account will immediately stop all active
                    document executions and delete all your API keys
                    permanently.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeactivateDialogOpen(true)}
                    className="w-full text-xs h-9 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/40 transition-colors cursor-pointer border rounded-md flex items-center justify-center font-bold bg-transparent"
                  >
                    Deactivate Account
                  </Button>
                </div>
              </div>
            </div>

            <DeactivateAccountDialog
              isOpen={isDeactivateDialogOpen}
              onClose={() => setIsDeactivateDialogOpen(false)}
              userEmail={userData?.email}
            />

            {/* Communication Preferences */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800/50">
                  <Bell className="h-5 w-5 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">
                  Communication Preferences
                </h3>
              </div>

              <GlowCard
                title="Email Notifications"
                sub="Manage how we contact you regarding your usage and account."
                icon={<Mail className="h-5 w-5 text-blue-400" />}
                content={
                  <div className="mt-6 space-y-6 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-white">
                          Usage Alerts
                        </h5>
                        <p className="text-xs text-slate-500">
                          Get notified when you reach 80% and 100% of your
                          limits.
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleToggle(
                            "notificationUsageAlerts",
                            !userData?.settings?.notificationUsageAlerts,
                          )
                        }
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${userData?.settings?.notificationUsageAlerts ? "bg-blue-600" : "bg-slate-700"}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${userData?.settings?.notificationUsageAlerts ? "translate-x-5" : "translate-x-0"}`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-white">
                          Billing & Renewals
                        </h5>
                        <p className="text-xs text-slate-500">
                          Important updates regarding your subscription status
                          and invoices.
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleToggle(
                            "notificationBillingUpdates",
                            !userData?.settings?.notificationBillingUpdates,
                          )
                        }
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${userData?.settings?.notificationBillingUpdates ? "bg-blue-600" : "bg-slate-700"}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${userData?.settings?.notificationBillingUpdates ? "translate-x-5" : "translate-x-0"}`}
                        />
                      </button>
                    </div>
                  </div>
                }
              />
            </div>

            {/* Identity & Profile Management */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800/50">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">
                  Identity & Security
                </h3>
              </div>

              <GlowCard
                title="Profile Details"
                sub="Manage your personal information."
                icon={<UserIcon className="h-5 w-5 text-blue-400" />}
                content={<ProfileForm />}
              />

              <GlowCard
                title="Workspace Settings"
                sub="Customize your team environment."
                icon={<Settings className="h-5 w-5 text-purple-400" />}
                content={<WorkspaceForm />}
              />
            </div>
          </div>
        </div>
      ) : currentTab === "governance" ? (
        <Governance
          isOwner={isOwner}
          policy={policy}
          updatePolicy={updatePolicy}
          policySignificant={policySignificant}
          policyMaterial={policyMaterial}
          setPolicySignificant={setPolicySignificant}
          setPolicyMaterial={setPolicyMaterial}
        />
      ) : currentTab === "webhooks" ? (
        <WebhooksTab
          organizationId={userData?.organizationId}
          planName={userData?.plan?.name}
        />
      ) : (
        <IntegrationsTab
          organizationId={userData?.organizationId}
          planName={userData?.plan?.name}
        />
      )}
    </div>
  );
}
