"use client";

import React, { useEffect, useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/app/button";
import { Github, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";

interface AuthCardProps {
  type: "sign-in" | "sign-up";
}

export const AuthCard: React.FC<AuthCardProps> = ({ type }) => {
  const {
    isLoaded: signInLoaded,
    signIn,
    setActive: setSignInActive,
  } = useSignIn();
  const {
    isLoaded: signUpLoaded,
    signUp,
    setActive: setSignUpActive,
  } = useSignUp();
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
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();

  const isSignIn = type === "sign-in";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pendingVerification && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [pendingVerification, countdown]);

  const handleResend = async () => {
    if (!signUpLoaded || !canResend) return;
    setResending(true);
    setError("");
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  const handleSocialSignIn = async (
    strategy: "oauth_google" | "oauth_github",
  ) => {
    if (isSignIn && !signInLoaded) return;
    if (!isSignIn && !signUpLoaded) return;

    const auth = isSignIn ? signIn : signUp;
    if (strategy === "oauth_google") setLoadingGoogle(true);
    if (strategy === "oauth_github") setLoadingGithub(true);

    try {
      await auth?.authenticateWithRedirect({
        strategy,
        redirectUrl: `/oauth-callback?intent=${isSignIn ? "sign-in" : "sign-up"}`,
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An error occurred");
      setLoadingGoogle(false);
      setLoadingGithub(false);
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded) return;
    setLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setSignUpActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Invalid verification code. Please check your email.");
      }
    } catch (err: any) {
      setError(
        err.errors?.[0]?.message || "An error occurred during verification",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isSignIn && password !== confirmPassword) {
      setError("Passwords do not match");
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
        if (!signInLoaded) return;
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete") {
          await setSignInActive({ session: result.createdSessionId });
          router.push("/dashboard");
        } else {
          console.log(result);
          setError("This account uses a different sign-in method.");
        }
      } else {
        if (!signUpLoaded) return;
        const result = await signUp.create({
          emailAddress: email,
          password,
        });

        // For simplicity, we assume no verification is needed or we use common flows.
        // If verification is needed, Clerk's pre-built component is often better,
        // but for a "bespoke" look we can redirect to a verification page.
        if (result.status === "complete") {
          await setSignUpActive({ session: result.createdSessionId });
          router.push("/dashboard");
        } else if (result.status === "missing_requirements") {
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });
          setPendingVerification(true);
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
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
                onClick={() => {
                  setPendingVerification(false);
                  setCode("");
                  setCountdown(60);
                  setCanResend(false);
                }}
                className="text-sm text-slate-500 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Wrong email address?</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
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

      <div className="mt-8 space-y-6">
        {/* Social Buttons */}
        {/* <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSocialSignIn("oauth_google")}
            disabled={loadingGoogle || loadingGithub}
            className="flex w-full items-center justify-center gap-3 cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingGoogle ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            <span>Google</span>
          </button>
          <button
            onClick={() => handleSocialSignIn("oauth_github")}
            disabled={loadingGoogle || loadingGithub}
            className="flex w-full items-center justify-center cursor-pointer gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingGithub ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Github className="h-5 w-5" />
            )}
            <span>GitHub</span>
          </button>
        </div> */}

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
          {!isSignIn && (
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
    </div>
  );
};
