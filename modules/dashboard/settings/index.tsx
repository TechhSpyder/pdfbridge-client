"use client";

import { useState, useEffect } from "react";
import { useUser, UserProfile, useAuth } from "@clerk/nextjs";
import { useMe } from "@/modules/hooks/queries";
import { Button, GlowCard, SmartContactLink } from "@/modules/app";
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
  Unplug,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useUpdateSettings,
  useIntegrations,
  useDisconnectIntegration,
} from "@/modules/hooks/queries";
import { toast } from "sonner";
import Title from "@/modules/app/title";
import { usePDFBridge } from "@/modules/hooks/use-pdfbridge";

export function SettingsPage() {
  const { data: userData, isLoading: userLoading } = useMe();
  const updateSettingsMutation = useUpdateSettings();

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
                              Up to {userData?.plan?.limit || 5} conversions /
                              month
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
                    Deactivating your account will immediately stop all PDF
                    conversions and delete all your API keys permanently.
                  </p>
                  <SmartContactLink
                    email="support@techhspyder.com"
                    isButton
                    className="w-full text-xs h-9 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/40 transition-colors cursor-pointer border rounded-md flex items-center justify-center font-bold"
                  >
                    Deactivate Account
                  </SmartContactLink>
                </div>
              </div>
            </div>

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
            </div>
          </div>
        </div>
      ) : userLoading ? (
        <div className="flex items-center justify-center p-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-3" />
          Loading user profile...
        </div>
      ) : (
        <IntegrationsTab organizationId={userData?.organizationId} />
      )}
    </div>
  );
}

function ProfileForm() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await user.update({
        firstName,
        lastName,
      });
      toast.success("Profile updated successfully!");
    } catch (e: any) {
      toast.error("Failed to update profile", {
        description: e.errors?.[0]?.longMessage || e.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-6 space-y-6 pt-2 border-t border-white/5">
      <div className="flex items-center gap-6">
        <img
          src={user?.imageUrl}
          alt="Avatar"
          className="h-16 w-16 rounded-full border border-white/10"
        />
        <div>
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            {user?.fullName}
          </h4>
          <p className="text-sm text-slate-400">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-black/40 border border-white/5 text-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-black/40 border border-white/5 text-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-white/5">
        <Button
          onClick={handleSave}
          disabled={
            isSaving ||
            (firstName === user?.firstName && lastName === user?.lastName)
          }
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 px-6 shadow-xl shadow-blue-500/10 transition-all disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function IntegrationsTab({ organizationId }: { organizationId?: string }) {
  const { data: connections, isLoading } = useIntegrations(organizationId);
  const disconnectMutation = useDisconnectIntegration(organizationId);
  const [connecting, setConnecting] = useState<string | null>(null);
  const sdk = usePDFBridge(organizationId);

  const handleConnect = async (provider: string) => {
    setConnecting(provider);
    try {
      const data = await sdk.getConnectUrl(provider);
      if (data.url) {
        // Redirect to platform oauth page
        window.location.href = data.url;
      } else {
        throw new Error("Failed to initiate handshake.");
      }
    } catch (e: any) {
      toast.error("Connection Failed", { description: e.message });
      setConnecting(null);
    }
  };

  const handleDisconnect = async (provider: string) => {
    if (confirm(`Are you sure you want to disconnect ${provider}?`)) {
      await disconnectMutation.mutateAsync(provider);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-3" />
        Loading your integrations...
      </div>
    );
  }

  // Find connections
  const xeroConnection = connections?.find(
    (c: any) => c.integrationId === "xero",
  );
  const quickbooksConnection = connections?.find(
    (c: any) => c.integrationId === "quickbooks",
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="prose prose-invert max-w-none mb-8">
        <p className="text-slate-400 text-sm">
          Connect PDFBridge directly to your accounting software. When we
          extract data from an uploaded invoice or receipt, we will seamlessly
          push it as a "Draft Bill" into your ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Xero Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/50 p-6 shadow-xl transition-all hover:border-blue-500/20">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-2 shadow-inner">
                {/* Simple Xero Logo Placeholder svg */}
                <svg viewBox="0 0 24 24" fill="#00B7E2" className="h-8 w-8">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14h-2.5l-2-2.5-2 2.5H7.5l3.5-4.5-3.5-4.5h2.5l2 2.5 2-2.5h2.5l-3.5 4.5 3.5 4.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Xero</h3>
                <p className="text-xs text-slate-400">
                  Global Accounting Ledger
                </p>
              </div>
            </div>

            {xeroConnection ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400 border border-slate-700">
                Not Connected
              </span>
            )}
          </div>

          <div className="relative z-10 mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
            {xeroConnection ? (
              <>
                <div className="text-xs text-slate-400 flex flex-col gap-1">
                  <span>Syncing to tenant:</span>
                  <strong className="text-white">
                    {xeroConnection.tenantName || "Unknown Company"}
                  </strong>
                </div>
                <Button
                  onClick={() => handleDisconnect("xero")}
                  variant="outline"
                  disabled={disconnectMutation.isPending}
                  className="text-red-400 border-red-500/10 hover:text-red-300 hover:bg-red-400/10 h-8 text-xs px-3"
                >
                  <Unplug className="w-3 h-3 mr-2" />
                  Disconnect
                </Button>
              </>
            ) : (
              <div className="w-full flex justify-end">
                <Button
                  onClick={() => handleConnect("xero")}
                  disabled={connecting === "xero"}
                  className="bg-[#00B7E2] hover:bg-[#00A0C6] text-white font-bold h-9 px-6 text-sm shadow-xl shadow-[#00B7E2]/20 transition-all active:scale-95 w-full sm:w-auto"
                >
                  {connecting === "xero" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Handshake...
                    </>
                  ) : (
                    "Connect with Xero"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* QuickBooks Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/50 p-6 shadow-xl transition-all hover:border-green-500/20">
          <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-2 shadow-inner">
                {/* QuickBooks Logo (Green Circle/Block) */}
                <div className="w-8 h-8 bg-[#2CA01C] rounded-lg flex items-center justify-center font-bold text-white text-[10px]">
                  QB
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">QuickBooks</h3>
                <p className="text-xs text-slate-400">Intuit Ledger</p>
              </div>
            </div>

            {quickbooksConnection ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400 border border-slate-700">
                Not Connected
              </span>
            )}
          </div>

          <div className="relative z-10 mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
            {quickbooksConnection ? (
              <>
                <div className="text-xs text-slate-400 flex flex-col gap-1">
                  <span>Syncing to company:</span>
                  <strong className="text-white">
                    {quickbooksConnection.tenantName || "QuickBooks Company"}
                  </strong>
                </div>
                <Button
                  onClick={() => handleDisconnect("quickbooks")}
                  variant="outline"
                  disabled={disconnectMutation.isPending}
                  className="text-red-400 border-red-500/10 hover:text-red-300 hover:bg-red-400/10 h-8 text-xs px-3"
                >
                  <Unplug className="w-3 h-3 mr-2" />
                  Disconnect
                </Button>
              </>
            ) : (
              <div className="w-full flex justify-end">
                <Button
                  onClick={() => handleConnect("quickbooks")}
                  disabled={connecting === "quickbooks"}
                  className="bg-[#2CA01C] hover:bg-[#258a18] text-white font-bold h-9 px-6 text-sm shadow-xl shadow-[#2CA01C]/20 transition-all active:scale-95 w-full sm:w-auto"
                >
                  {connecting === "quickbooks" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Handshake...
                    </>
                  ) : (
                    "Connect QuickBooks"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
