"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function OAuthCallbackPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-[#010309] text-white">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-slate-400 font-medium">Securing your session...</p>
      
      {/* 
        This Clerk component automatically parses the URL hash/query 
        parameters passed back from GitHub and redirects to the configured URLs.
      */}
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
      />
    </div>
  );
}
