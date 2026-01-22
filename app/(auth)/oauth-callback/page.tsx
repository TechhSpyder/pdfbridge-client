"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function OAuthCallbackPage() {
  const { client } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const signIn = client?.signIn;
    const error = signIn?.firstFactorVerification?.error;

    if (error?.code === "external_account_not_found") {
      toast.error("No account found. Please sign up first.");
      router.replace("/sign-up");
      return;
    }

    if (signIn?.status === "complete") {
      router.replace("/dashboard");
      return;
    }
  }, [client, router]);

  return (
    <div className="flex h-screen items-center justify-center text-slate-400">
      Completing authentication…
    </div>
  );
}
