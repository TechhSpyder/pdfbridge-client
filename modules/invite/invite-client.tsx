"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useUser, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button, GlowCard } from "@/modules/app";
import {
  Building2,
  Mail,
  CheckCircle,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Local fetcher since this page needs to handle both unauthenticated and authenticated states.
// useApiClient assumes auth headers are required.
const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function InviteClient({ token }: { token: string }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { openSignIn, openSignUp } = useClerk();
  const router = useRouter();

  // 1. Verify the token publicly to show the inviter details.
  const {
    data: verifyData,
    isLoading: isVerifying,
    isError: verificationFailed,
  } = useQuery({
    queryKey: ["invite", token],
    queryFn: async () => {
      const res = await fetch(
        `${apiBase}/api/v1/invites/verify?token=${token}`,
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Invalid invite");
      }
      return res.json();
    },
    retry: false,
  });

  // 2. Accept the invite (requires auth)
  const acceptMutation = useMutation({
    mutationFn: async () => {
      // Must manually pass auth token since this client doesn't use useApiClient wrapper
      const sessionToken = await (window as any).Clerk?.session?.getToken();

      const res = await fetch(`${apiBase}/api/v1/invites/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to accept invite");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Welcome to the team!");
      router.push("/dashboard");
    },
    onError: (err: any) => {
      toast.error("Failed to join organization", {
        description: err.message,
      });
    },
  });

  // 3. Decline the invite
  const declineMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${apiBase}/api/v1/invites/decline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to decline invite");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Invitation declined.");
      router.push("/");
    },
    onError: (err: any) => {
      toast.error("Error declining invitation", {
        description: err.message,
      });
    },
  });

  // Automatically attempt to accept if already logged in and token is valid.
  // Actually, better to explicitly make them click so they know what org they are joining.

  if (!isLoaded || isVerifying) {
    return (
      <GlowCard
        className="p-8 text-center"
        content={
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-slate-400 text-sm font-medium">
              Verifying invitation...
            </p>
          </div>
        }
      />
    );
  }

  if (verificationFailed) {
    return (
      <GlowCard
        className="p-8 text-center border-red-500/20"
        content={
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Invalid or Expired Invite
            </h2>
            <p className="text-sm text-slate-400 text-center max-w-[250px]">
              This invitation link is no longer valid or has expired. Please ask
              the administrator to send a new one.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="mt-4 bg-slate-800 hover:bg-slate-700 text-white w-full"
            >
              Return to Homepage
            </Button>
          </div>
        }
      />
    );
  }

  const { organization, email: intendedEmail, role } = verifyData.data;

  // If user is signed in with a different email, warn them
  const isEmailMismatch =
    isSignedIn && user.primaryEmailAddress?.emailAddress !== intendedEmail;

  return (
    <GlowCard
      className="p-8"
      content={
        <div className="flex flex-col items-center gap-6 py-6 border-t border-white/5 relative z-10">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center border border-white/10 shadow-2xl relative">
            <Building2 className="h-10 w-10 text-white relative z-10" />
            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Join {organization.name}
            </h1>
            <p className="text-sm text-slate-400">
              You've been invited to join this organization as a{" "}
              <span className="text-emerald-400 font-medium capitalize">
                {role.toLowerCase()}
              </span>
              .
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">
                  Invited Email
                </p>
                <p className="text-sm font-bold text-white truncate">
                  {intendedEmail}
                </p>
              </div>
            </div>

            {isEmailMismatch && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 text-amber-500 text-xs text-left">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <p>
                  You are currently signed in as{" "}
                  <strong>{user.primaryEmailAddress?.emailAddress}</strong>,
                  which does not match the invited email. You can still accept,
                  but ensure this is intended.
                </p>
              </div>
            )}

            {!isSignedIn ? (
              <div className="pt-4 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full bg-black/40 border-white/10 text-white hover:bg-white/5 h-12"
                  onClick={() =>
                    openSignIn({ fallbackRedirectUrl: `/invite/${token}`, forceRedirectUrl: `/invite/${token}` })
                  }
                >
                  Log In
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/10 h-12"
                  onClick={() =>
                    openSignUp({ fallbackRedirectUrl: `/invite/${token}`, forceRedirectUrl: `/invite/${token}` })
                  }
                >
                  Create Account
                </Button>
              </div>
            ) : (
              <div className="pt-4 space-y-3">
                <Button
                  onClick={() => acceptMutation.mutate()}
                  disabled={
                    acceptMutation.isPending || declineMutation.isPending
                  }
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-xl shadow-emerald-500/20"
                >
                  {acceptMutation.isPending
                    ? "Joining..."
                    : "Accept Invitation"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => declineMutation.mutate()}
                  disabled={
                    acceptMutation.isPending || declineMutation.isPending
                  }
                  className="w-full h-12 border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  {declineMutation.isPending
                    ? "Declining..."
                    : "Decline Invitation"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    openSignUp({ fallbackRedirectUrl: `/invite/${token}`, forceRedirectUrl: `/invite/${token}` })
                  }
                  className="w-full text-xs text-slate-500 hover:text-white border-transparent bg-transparent"
                >
                  Use a different account
                </Button>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
