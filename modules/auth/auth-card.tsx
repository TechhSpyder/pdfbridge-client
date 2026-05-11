"use client";

import React, { useEffect, useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/app/button";
import { Github } from "lucide-react";
import { Mail } from "lucide-react";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import { PasswordStrengthIndicator } from "./password-strength";
import { toast } from "sonner";
import { VerifyOtpForm } from "./verify-otp-form";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";

interface AuthCardProps {
  type: "sign-in" | "sign-up";
}

export const AuthCard: React.FC<AuthCardProps> = ({ type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const { connected, publicKey, signMessage, connect } = useWallet();
  const { setVisible } = useWalletModal();
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [walletCollision, setWalletCollision] = useState<{
    maskedEmail: string | null;
    message: string;
  } | null>(null);
  const router = useRouter();

  // Preserve the user entrypoint (ex: judges coming from /compiler).
  const returnTo =
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("returnTo") ??
        "/dashboard")
      : "/dashboard";
  const [showTurnstile, setShowTurnstile] = useState(false);
  const isSignIn = type === "sign-in";

  useEffect(() => {
    if (!isSignIn) {
      setShowTurnstile(true);
    }
  }, [isSignIn]);

  useEffect(() => {
    const key =
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
    if (key === "1x00000000000000000000AA") {
      console.warn(
        "[TURNSTILE] Using LOCAL TEST site key. This WILL fail on production domains.",
      );
    } else {
    }
  }, []);

  const handleSocialSignIn = async (provider: "google" | "github") => {
    if (provider === "google") setLoadingGoogle(true);
    if (provider === "github") setLoadingGithub(true);

    try {
      await signIn.social({
        provider,
        callbackURL: `${window.location.origin}${returnTo}`,
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during social sign-in");
      setLoadingGoogle(false);
      setLoadingGithub(false);
    }
  };

  const handleWalletSignIn = async () => {
    if (!connected || !publicKey) {
      toast.info("Connecting to Wallet...");
      setVisible(true);
      return;
    }

    setLoadingWallet(true);
    setError("");

    try {
      // 1. Get Nonce from server (Using Unified Proxy Shield)
      const challengeRes = await fetch(`/api/auth/solana/challenge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: publicKey.toBase58() }),
      });

      if (!challengeRes.ok) throw new Error("Could not fetch auth challenge.");
      const { nonce } = await challengeRes.json();

      // 2. Sign the message
      if (!signMessage)
        throw new Error("Wallet does not support message signing!");

      const message = new TextEncoder().encode(
        `Sign this message to verify your identity with PDFBridge: ${nonce}`,
      );
      const signature = await signMessage(message);

      // 3. Verify and Start Session (Using Unified Proxy Shield)
      const verifyRes = await fetch(`/api/auth/solana/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Required to receive and send back session cookies
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          // Use native hex conversion instead of Buffer to avoid polyfill issues
          signature: Array.from(signature)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(""),
          nonce,
        }),
      });

      if (!verifyRes.ok) throw new Error("Wallet authentication failed.");

      const verifyData = await verifyRes.json();

      // Detect identity collision — wallet belongs to a different existing account
      if (verifyData.status === "WALLET_COLLISION") {
        setWalletCollision({
          maskedEmail: verifyData.maskedEmail,
          message: verifyData.message,
        });
        setLoadingWallet(false);
        return;
      }

      toast.success("Identity Verified. Welcome back!");
      setIsRouting(true);
      window.location.href = returnTo;
    } catch (err: any) {
      console.error("[WALLET AUTH ERROR]", err);
      setError(err.message || "Failed to authenticate with wallet.");
    } finally {
      setLoadingWallet(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isSignIn && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isSignIn && !isPasswordValid) {
      setError("Please meet all password strength requirements.");
      return;
    }

    if (!isSignIn && !turnstileToken) {
      setError("Please complete the security check.");
      return;
    }

    setLoading(true);

    try {
      if (!isSignIn) {
        // Verify Turnstile on our server
        const verifyRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-turnstile`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: turnstileToken }),
          },
        );

        if (!verifyRes.ok) {
          const errData = await verifyRes.json();
          setError(errData.message || "Security verification failed.");
          setLoading(false);
          return;
        }
      }

      if (isSignIn) {
        const { data, error } = await signIn.email({
          email,
          password,
          callbackURL: returnTo,
        });

        if (error) {
          setError(error.message || "Invalid email or password");
        } else {
          toast.success("Welcome back to PDFBridge!");
          setIsRouting(true);
          router.push(returnTo);
        }
      } else {
        const { data, error } = await signUp.email({
          email,
          password,
          name: email.split("@")[0], // Fallback name
          callbackURL: returnTo,
        });

        if (error) {
          setError(error.message || "Failed to create account");
        } else {
          // Success! Show the OTP verification screen
          toast.success(
            "Account created! Please check your email for the verification code.",
          );
          setPendingVerification(true);
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return <VerifyOtpForm email={email} />;
  }

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-center mb-6">
        <Link
          href="/?redirect=false"
          className="group flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-white transition-all duration-300 px-3 py-1.5 rounded-full border border-white/5 hover:border-white/10 bg-white/5"
        >
          <svg
            className="w-3 h-3 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to home
        </Link>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {isSignIn ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="mt-4 text-slate-400">
          {isSignIn
            ? "Sign in to manage your institutional ingestion bridge."
            : "Industrial-grade invoice processing at scale."}
        </p>
      </div>

      {isRouting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617]/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-r-2 border-l-2 border-indigo-500 animate-spin-slow"></div>
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

      {/* Wallet Identity Collision Banner */}
      {walletCollision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-[#0f172a] border border-amber-500/30 rounded-2xl p-8 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
              <Wallet className="h-7 w-7 text-amber-400" />
            </div>
            <div className="text-center">
              <h3 className="text-white font-black text-lg mb-1">
                Wallet Already Linked
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {walletCollision.message}
              </p>
            </div>
            {walletCollision.maskedEmail && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                  Account Email
                </p>
                <p className="text-white font-mono text-sm">
                  {walletCollision.maskedEmail}
                </p>
              </div>
            )}
            <p className="text-[11px] text-slate-500 text-center">
              Sign in with Google or your email above to access your settlement
              history.
            </p>
            <button
              onClick={() => setWalletCollision(null)}
              className="w-full py-3 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-6">
        {/* Social Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => handleSocialSignIn("google")}
            disabled={loadingGoogle || loadingGithub || loadingWallet}
            className="flex w-full items-center justify-center cursor-pointer gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingGoogle ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-900" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSocialSignIn("github")}
              disabled={loadingGoogle || loadingGithub || loadingWallet}
              className="flex w-full items-center justify-center cursor-pointer gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loadingGithub ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Github className="h-5 w-5" />
              )}
              <span>GitHub</span>
            </button>

            <button
              onClick={handleWalletSignIn}
              disabled={loadingGoogle || loadingGithub || loadingWallet}
              className="flex w-full items-center justify-center cursor-pointer gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500/10 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loadingWallet ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Wallet className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              )}
              <span>Solana</span>
            </button>
          </div>
        </div>

        {/* <div className="relative flex items-center py-4">
          <div className="grow border-t border-white/10"></div>
          <span className="mx-4 shrink text-sm text-slate-500">
            or continue with email
          </span>
          <div className="grow border-t border-white/10"></div>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="email"
            >
              Email address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="email"
                type="email"
                required
                className="block w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="password"
            >
              Password
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
            {isSignIn && (
              <div className="mt-2 flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-blue-500 hover:text-blue-400 transition"
                >
                  Forgot password?
                </Link>
              </div>
            )}
            {!isSignIn && (
              <PasswordStrengthIndicator
                password={password}
                onValidationChange={setIsPasswordValid}
              />
            )}
          </div>

          {!isSignIn && (
            <div>
              <label
                className="block text-sm font-medium text-slate-300"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {/* {!isSignIn && (
            <div className="flex justify-center py-2">
              <Turnstile
                siteKey={
                  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
                  "1x00000000000000000000AA"
                }
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                onError={() => {
                  setError("Error loading security check. Please refresh.");
                  setTurnstileToken(null);
                }}
                options={{
                  theme: "dark",
                }}
              />
            </div>
          )} */}
          {showTurnstile && (
            <div className="flex flex-col items-center gap-2 py-2">
              <Turnstile
                siteKey={
                  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
                  "1x00000000000000000000AA"
                }
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                onError={() => {
                  setError("Error loading security check. Please refresh.");
                  setTurnstileToken(null);
                }}
                options={{ theme: "dark" }}
              />
              <p className="text-[10px] text-slate-500 text-center">
                Security check failing? Try disabling extensions (like MetaMask)
                or use an Incognito window.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-base font-bold shadow-xl shadow-blue-500/10 flex items-center justify-center"
          >
            {loading
              ? "Processing..."
              : isSignIn
                ? "Sign In"
                : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 pb-6">
          {isSignIn ? "New to PDFBridge? " : "Already have an account? "}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-semibold text-blue-500 hover:text-blue-400 transition"
          >
            {isSignIn ? "Sign up for free" : "Sign in to your account"}
          </Link>
        </p>
      </div>

      {/* Post-Auth Routing Loader */}
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
