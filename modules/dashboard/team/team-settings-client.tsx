"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button, GlowCard, UserAvatar } from "@/modules/app";
import {
  Users,
  Mail,
  Trash2,
  UserPlus,
  Clock,
  ShieldAlert,
} from "lucide-react";

import { useMe } from "@/modules/hooks/queries";
import { useApiClient } from "@/utils/api-client";
import { IPWhitelistManager } from "./ip-whitelist-manager";

export function TeamSettingsClient() {
  const { data: session } = useSession();
  const { data: me } = useMe();
  const api = useApiClient();
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const orgId = me?.organizationId;

  const { data: teamData, isLoading } = useQuery({
    queryKey: ["team", orgId],
    queryFn: async () => {
       if (!orgId) return null;
       const res = await api.get(`/api/v1/organizations/${orgId}/members`);
       return res;
    },
    enabled: !!orgId,
    refetchInterval: 5000,
  });

  const inviteMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post(`/api/v1/organizations/${orgId}/invites`, {
        email,
      });
      return res;
    },
    onSuccess: () => {
      toast.success("Invite sent successfully!");
      setInviteEmail("");
      setIsInviting(false);
      queryClient.invalidateQueries({ queryKey: ["team", orgId] });
    },
    onError: (err: any) => {
      toast.error("Failed to send invite", {
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message,
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (targetId: string) => {
      const res = await api.delete(
        `/api/v1/organizations/${orgId}/members/${targetId}`,
      );
      return res;
    },
    onSuccess: () => {
      toast.success("Member removed");
      queryClient.invalidateQueries({ queryKey: ["team", orgId] });
    },
    onError: (err: any) => {
      toast.error("Failed to remove member", {
        description: err.response?.data?.error || err.message,
      });
    },
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMutation.mutate(inviteEmail);
  };

  const members = teamData?.members || [];
  const invites = teamData?.invites || [];
  const seatLimit = teamData?.seatLimit || 1;
  const seatsUsed = teamData?.seatsUsed || 0;
  const isAtLimit = seatsUsed >= seatLimit;

  // Better-Auth role check
  const user = session?.user as any;
  const isOwner = user?.role === "owner" || user?.role === "OWNER";

  return (
    <>
      {isLoading ? (
        <div className="space-y-8 animate-pulse">
           <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <div className="col-span-1 h-36 bg-slate-800/40 rounded-xl border border-white/5"></div>
            <div className="col-span-1 md:col-span-2 h-36 bg-slate-800/40 rounded-xl border border-white/5"></div>
          </div>
          <div className="space-y-4">
            <div className="h-6 w-40 bg-slate-800/40 rounded"></div>
            <div className="h-48 bg-slate-800/40 rounded-xl border border-white/5"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <div className="col-span-1">
              <GlowCard
                title="Seats Used"
                content={
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-4xl font-bold text-white tracking-tight">
                      {seatsUsed}
                    </span>
                    <span className="text-slate-400 mb-1">/ {seatLimit}</span>
                  </div>
                }
              />
            </div>

            {isOwner && (
              <GlowCard
                className="md:col-span-2"
                title="Invite New Member"
                sub="Send a secure invite link to their email (valid for 7 days)."
                icon={<UserPlus className="h-5 w-5 text-blue-500" />}
                content={
                  <div className="mt-6">
                    {isAtLimit ? (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 text-amber-500 text-sm">
                        <ShieldAlert className="h-5 w-5 shrink-0" />
                        <p>
                          You have reached your plan's maximum seat limit (
                          {seatLimit}
                          ). Upgrade your plan in billing to add more team
                          members.
                        </p>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleInvite}
                        className="flex flex-col sm:flex-row gap-3 items-end"
                      >
                        <div className="flex-1 space-y-2">
                          <label className="text-xs font-medium text-slate-400">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="colleague@company.com"
                            className="w-full h-10 px-3 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={inviteMutation.isPending || !inviteEmail}
                          className="h-10 w-full sm:w-auto px-6 bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/20"
                        >
                          {inviteMutation.isPending
                            ? "Sending..."
                            : "Send Invite"}
                        </Button>
                      </form>
                    )}
                  </div>
                }
              />
            )}
          </div>

          {invites.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" /> Pending Invites
              </h3>
              <div className="rounded-xl border border-white/10 overflow-x-auto overflow-y-hidden bg-slate-900/50 backdrop-blur-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {invites.map((invite: any) => (
                      <tr key={invite.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white flex items-center gap-3">
                          <Mail className="h-4 w-4 text-slate-500" />
                          {invite.email}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          <span className="px-2 py-1 rounded text-[10px] font-bold tracking-widest bg-slate-800 border border-slate-700 uppercase">
                            {invite.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isOwner && (
                            <button
                              onClick={() => removeMemberMutation.mutate(invite.id)}
                              disabled={removeMemberMutation.isPending}
                              className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg inline-flex"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-500" /> Active Members
            </h3>
            <div className="rounded-xl border border-white/10 overflow-x-auto overflow-y-hidden bg-slate-900/50 backdrop-blur-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {members.map((member: any) => {
                    const isCurrentUser = member.email === session?.user?.email;
                    return (
                      <tr key={member.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-medium flex items-center gap-3">
                          <UserAvatar
                            name={member.name}
                            image={member.image}
                            size="sm"
                          />
                          <div className="flex flex-col">
                            <span>{member.email}</span>
                            {isCurrentUser && (
                              <span className="text-[10px] w-fit bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">You</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest border uppercase ${member.role === 'OWNER' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isOwner && !isCurrentUser && member.role !== 'OWNER' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove ${member.email}?`)) {
                                  removeMemberMutation.mutate(member.id);
                                }
                              }}
                              disabled={removeMemberMutation.isPending}
                              className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg inline-flex"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <IPWhitelistManager
            initialWhitelist={me?.ipWhitelist || []}
            isEnterprise={!!me?.plan?.allowIpWhitelisting}
          />
        </div>
      )}
    </>
  );
}
