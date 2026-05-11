import { Button } from "@/modules/app";
import {
  useDisconnectIntegration,
  useIntegrations,
  usePDFBridge,
} from "@/modules/hooks/queries";
import { Lock, Loader2, Unplug, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

// Plans that have ERP/accounting integrations unlocked
const INTEGRATION_PLANS = ["Startup", "Growth", "Scale", "Enterprise"];

export function IntegrationsTab({
  organizationId,
  planName,
}: {
  organizationId?: string;
  planName?: string;
}) {
  const { data: connections, isLoading } = useIntegrations(organizationId);
  const disconnectMutation = useDisconnectIntegration(organizationId);
  const [connecting, setConnecting] = useState<string | null>(null);
  const sdk = usePDFBridge(organizationId);

  const isLocked = !planName || !INTEGRATION_PLANS.includes(planName);

  const handleConnect = async (provider: string) => {
    setConnecting(provider);
    try {
      const data = await sdk.getConnectUrl(provider);
      if (data.url) {
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

  const xeroConnection = connections?.find(
    (c: any) => c.integrationId === "xero",
  );
  const quickbooksConnection = connections?.find(
    (c: any) => c.integrationId === "quickbooks",
  );

  const providers = [
    {
      id: "xero" as const,
      name: "Xero",
      description: "Global Accounting Ledger",
      color: "#00B7E2",
      logo: (
        <svg viewBox="0 0 24 24" fill="#00B7E2" className="h-8 w-8">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14h-2.5l-2-2.5-2 2.5H7.5l3.5-4.5-3.5-4.5h2.5l2 2.5 2-2.5h2.5l-3.5 4.5 3.5 4.5z" />
        </svg>
      ),
      connection: xeroConnection,
    },
    {
      id: "quickbooks" as const,
      name: "QuickBooks",
      description: "Intuit Ledger",
      color: "#2CA01C",
      logo: (
        <div className="w-8 h-8 bg-[#2CA01C] rounded-lg flex items-center justify-center font-bold text-white text-[10px]">
          QB
        </div>
      ),
      connection: quickbooksConnection,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="prose prose-invert max-w-none mb-8">
        <p className="text-slate-400 text-sm">
          Connect PDFBridge directly to your accounting software. When we
          extract data from an uploaded invoice or receipt, we will seamlessly
          push it as a &quot;Draft Bill&quot; into your ledger.
        </p>
      </div>

      {/* Gate wall for Builder / free plan */}
      {isLocked ? (
        <div className="rounded-2xl h-[350px] border border-white/10 bg-slate-900/50 overflow-hidden shadow-2xl">
          {/* Blurred preview of the integration cards */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pointer-events-none select-none blur-[3px] opacity-40">
              {providers.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-white/15 bg-slate-900/50 p-6"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-2">
                      {p.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{p.name}</h3>
                      <p className="text-xs text-slate-400">{p.description}</p>
                    </div>
                  </div>
                  <div className="h-9 w-full rounded-lg bg-slate-700" />
                </div>
              ))}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Lock className="h-7 w-7 text-blue-400" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="text-xl font-bold text-white">
                  ERP Integrations — Startup+
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Xero and QuickBooks sync is available on the{" "}
                  <span className="text-blue-400 font-semibold">
                    Startup plan and above
                  </span>
                  . Upgrade to automatically push extracted invoice data as
                  Draft Bills to your accounting ledger.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <Link href="/dashboard/billing" className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 font-bold gap-2">
                    <Zap className="h-4 w-4" />
                    Upgrade to Startup — $19/mo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map((p) => (
            <IntegrationCard
              key={p.id}
              provider={p.id}
              name={p.name}
              description={p.description}
              brandColor={p.color}
              logo={p.logo}
              connection={p.connection}
              isLoading={isLoading}
              isConnecting={connecting === p.id}
              isDisconnecting={disconnectMutation.isPending}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type IntegrationProvider = "xero" | "quickbooks";

type IntegrationCardProps = {
  provider: IntegrationProvider;
  name: string;
  description: string;
  brandColor: string;
  logo: React.ReactNode;
  connection?: any;
  isLoading: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  onConnect: (provider: IntegrationProvider) => void;
  onDisconnect: (provider: IntegrationProvider) => void;
};

function IntegrationCard({
  provider,
  name,
  description,
  brandColor,
  logo,
  connection,
  isLoading,
  isConnecting,
  isDisconnecting,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) {
  const status = isLoading ? "loading" : connection ? "connected" : "idle";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/50 p-6 shadow-xl transition-all hover:border-white/20 w-full">
      <div
        className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: `linear-gradient(to bottom right, ${brandColor}10, transparent)`,
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-2 shadow-inner">
            {logo}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{name}</h3>
            <p className="text-xs text-slate-400">{description}</p>
          </div>
        </div>

        {/* Status */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${
            status === "connected"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-slate-800 text-slate-400 border-slate-700"
          }`}
        >
          {status === "loading" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : status === "connected" ? (
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          ) : null}

          {status === "loading"
            ? "Checking..."
            : status === "connected"
              ? "Connected"
              : "Not Connected"}
        </span>
      </div>

      {/* CTA */}
      <div className="relative z-10 mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
        {connection ? (
          <>
            <div className="text-xs text-slate-400 flex flex-col gap-1">
              <span>Connected to:</span>
              <strong className="text-white">
                {connection.tenantName || "Unknown"}
              </strong>
            </div>

            <button
              onClick={() => onDisconnect(provider)}
              disabled={isLoading || isDisconnecting}
              className="text-red-400 border border-red-500/10 hover:text-red-300 hover:bg-red-400/10 h-8 text-xs px-3 rounded-lg flex items-center"
            >
              {isDisconnecting ? (
                <Loader2 className="w-3 h-3 animate-spin mr-2" />
              ) : (
                <Unplug className="w-3 h-3 mr-2" />
              )}
              Disconnect
            </button>
          </>
        ) : (
          <div className="w-full flex justify-end">
            <button
              onClick={() => onConnect(provider)}
              disabled={isLoading || isConnecting}
              className="text-white font-bold h-9 px-6 text-sm rounded-lg shadow-xl transition-all active:scale-95 w-full sm:w-auto"
              style={{ backgroundColor: brandColor }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking...
                </div>
              ) : isConnecting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Handshake...
                </div>
              ) : (
                `Connect ${name}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
