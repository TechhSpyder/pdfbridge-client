"use client";

import { useState } from "react";
import { GlowCard, Button } from "@/modules/app";
import { Shield, Plus, X, Globe, Lock } from "lucide-react";
import { useUpdateIpWhitelist } from "@/modules/hooks/queries";
import { toast } from "sonner";

interface IPWhitelistManagerProps {
  initialWhitelist: string[];
  isEnterprise: boolean;
}

export function IPWhitelistManager({
  initialWhitelist,
  isEnterprise,
}: IPWhitelistManagerProps) {
  const [ips, setIps] = useState<string[]>(initialWhitelist || []);
  const [newIp, setNewIp] = useState("");
  const updateMutation = useUpdateIpWhitelist();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newIp.trim();
    if (!trimmed) return;

    // Basic IP validation (IPv4 or IPv6)
    const ipRegex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

    if (!ipRegex.test(trimmed)) {
      toast.error("Invalid IP address format");
      return;
    }

    if (ips.includes(trimmed)) {
      toast.error("IP already in whitelist");
      return;
    }

    const nextIps = [...ips, trimmed];
    setIps(nextIps);
    setNewIp("");
    updateMutation.mutate(nextIps);
  };

  const handleRemove = (ipToRemove: string) => {
    const nextIps = ips.filter((ip) => ip !== ipToRemove);
    setIps(nextIps);
    updateMutation.mutate(nextIps);
  };

  return (
    <GlowCard
      title="API IP Whitelisting"
      sub="Restrict API access to specific IP addresses"
      icon={<Shield className="h-5 w-5 text-emerald-500" />}
      content={
        <div className="mt-6 space-y-6">
          {!isEnterprise ? (
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-amber-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white">Enterprise Feature</h4>
                <p className="text-sm text-slate-400 max-w-xs">
                  IP Whitelisting is available on Enterprise plans. Upgrade to
                  enhance your API security.
                </p>
              </div>
              <Button href="/dashboard/billing" className="mt-2">
                Upgrade to Enterprise
              </Button>
            </div>
          ) : (
            <>
              <form onSubmit={handleAdd} className="flex gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    placeholder="e.g. 192.168.1.1"
                    className="w-full h-11 pl-10 pr-4 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || !newIp}
                  className="h-11 px-6 bg-emerald-600 hover:bg-emerald-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add IP
                </Button>
              </form>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Whitelisted IPs ({ips.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {ips.length === 0 ? (
                    <p className="text-sm text-slate-500 italic py-2">
                      No IPs whitelisted. API is open to all IPs.
                    </p>
                  ) : (
                    ips.map((ip) => (
                      <div
                        key={ip}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 hover:border-emerald-500/30 transition-all"
                      >
                        <code>{ip}</code>
                        <button
                          onClick={() => handleRemove(ip)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      }
    />
  );
}
