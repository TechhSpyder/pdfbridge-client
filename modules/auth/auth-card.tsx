"use client";

import React, { useEffect, useState } from "react";
import { authClient, signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/app/button";
import { Github } from "lucide-react";
import { Mail } from "lucide-react";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Lock } from "lucide-react";
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
  const router = useRouter();
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
      console.log(`[TURNSTILE] Loaded site key: ${key.substring(0, 6)}...`);
    }
  }, []);



  const handleSocialSignIn = async (provider: "google" | "github") => {
    if (provider === "google") setLoadingGoogle(true);
    if (provider === "github") setLoadingGithub(true);

    try {
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
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
      if (!signMessage) throw new Error("Wallet does not support message signing!");
      
      const message = new TextEncoder().encode(`Sign this message to verify your identity with PDFBridge: ${nonce}`);
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
      
      toast.success("Identity Verified. Welcome back!");
      setIsRouting(true);
      
      // Use hard redirect to ensure the session cookie is picked up by middleware/server-side
      window.location.href = "/dashboard";
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
          callbackURL: "/dashboard",
        });

        if (error) {
          setError(error.message || "Invalid email or password");
        } else {
          toast.success("Welcome back to PDFBridge!");
          setIsRouting(true);
          router.push("/dashboard");
        }
      } else {
        const { data, error } = await signUp.email({
          email,
          password,
          name: email.split("@")[0], // Fallback name
          callbackURL: "/dashboard",
        });

        if (error) {
          setError(error.message || "Failed to create account");
        } else {
          // Success! Show the OTP verification screen
          toast.success("Account created! Please check your email for the verification code.");
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
    return (
      <VerifyOtpForm 
        email={email} 
      />
    );
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
            ? "Sign in to manage your PDF conversion bridge."
            : "Start building with the world's fastest PDF API."}
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

      <div className="mt-8 space-y-6">
        {/* Social Buttons */}
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
