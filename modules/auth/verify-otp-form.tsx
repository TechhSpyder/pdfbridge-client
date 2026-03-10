"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/app/button";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VerifyOtpFormProps {
  email: string;
  onSuccess?: () => void;
}

export const VerifyOtpForm: React.FC<VerifyOtpFormProps> = ({ email, onSuccess }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (!canResend) return;
    setResending(true);
    setError("");
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });
      if (error) {
        setError(error.message || "Failed to resend code");
      } else {
        toast.success("Verification code resent! Please check your email.");
        setCountdown(60);
        setCanResend(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
      });

      if (error) {
        setError(error.message || "Invalid verification code");
      } else {
        toast.success("Account verified successfully! Welcome to PDFBridge.");
        setIsRouting(true);
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6 group transition-transform hover:scale-110">
          <Mail className="h-8 w-8 text-blue-500 group-hover:animate-bounce" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Verify Your Email
        </h2>
        <p className="mt-4 text-slate-400">
          Enter the 6-digit code we sent to <br />
          <span className="text-white font-semibold">{email}</span>
        </p>
      </div>

      <form onSubmit={onVerify} className="mt-8 space-y-8">
        <div className="space-y-6">
          <div className="relative group">
            <label
              className="block text-sm font-medium text-slate-400 mb-2 transition-colors group-focus-within:text-blue-500"
              htmlFor="code"
            >
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              required
              maxLength={6}
              className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-white placeholder-slate-600 transition-all duration-300 focus:border-blue-500/50 focus:bg-white/[0.07] focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-center tracking-[0.75em] font-mono text-3xl uppercase"
              placeholder="••••••"
              value={code}
              autoComplete="one-time-code"
              onChange={(e) =>
                setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
              }
            />
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-shake">
              <p className="text-sm text-red-500 text-center">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full py-5 text-lg font-bold shadow-2xl shadow-blue-500/20 flex items-center justify-center group relative overflow-hidden active:scale-[0.98] transition-transform"
          >
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>

          <div className="flex flex-col items-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || resending}
              className="group flex items-center gap-2 text-sm transition-all duration-300 disabled:opacity-50"
            >
              {resending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span
                  className={`${canResend ? "text-blue-500 hover:text-blue-400 font-semibold" : "text-slate-500"}`}
                >
                  {canResend ? "Resend code" : `Resend code in ${countdown}s`}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={async () => {
                await authClient.signOut();
                router.push("/sign-in");
                router.refresh();
              }}
              className="text-sm text-slate-500 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </form>

      {isRouting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617]/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-blue-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-8 text-lg font-medium text-white animate-pulse">
            Configuring your workspace...
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Redirecting to dashboard
          </p>
        </div>
      )}
    </div>
  );
};
