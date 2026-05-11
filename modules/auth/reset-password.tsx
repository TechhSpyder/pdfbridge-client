"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/modules/app/button";
import { Lock, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PasswordStrengthIndicator } from "@/modules/auth/password-strength";
import { toast } from "sonner";

export function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Better-Auth reset password usually works with a token from the URL
  const token = searchParams.get("token") || "";

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.push("/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isPasswordValid) {
      setError("Please meet all password strength requirements.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token: token,
      });

      if (resetError) {
        throw new Error(resetError.message || "Failed to reset password");
      }

      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-12">
        <div className="relative z-10 w-full max-w-md text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Password Reset!
          </h2>
          <p className="text-slate-400">
            Your password has been successfully updated. Redirecting you to sign in...
          </p>
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-12">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Create New Password
          </h2>
          <p className="mt-4 text-slate-400">
            Enter your new secure password below to regain access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-slate-300"
                htmlFor="password"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <PasswordStrengthIndicator
                password={password}
                onValidationChange={setIsPasswordValid}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-slate-300"
                htmlFor="confirm-password"
              >
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                className="mt-1 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-500 text-center">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full py-4 text-base font-bold shadow-xl shadow-blue-500/10 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-slate-500 hover:text-white transition-colors"
          >
            Back to forgot password
          </Link>
        </div>
      </div>
    </div>
  );
}
