"use client";

import React, { useEffect, useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/app/button";
import { Github, Mail } from "lucide-react";
import Link from "next/link";

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
  const router = useRouter();

  // useEffect(() => {
  //   const provider = new URLSearchParams(window.location.search).get(
  //     "provider",
  //   );

  //   if (provider === "google") {
  //     handleSocialSignIn("oauth_google");
  //   }
  // }, []);

  const isSignIn = type === "sign-in";

  const handleSocialSignIn = async (
    strategy: "oauth_google" | "oauth_github",
  ) => {
    if (isSignIn && !signInLoaded) return;
    if (!isSignIn && !signUpLoaded) return;

    try {
      const auth = isSignIn ? signIn : signUp;
      await auth?.authenticateWithRedirect({
        strategy,
        // redirectUrl: isSignIn ? "/sign-in" : "/sign-up",
        redirectUrl: `/oauth-callback?intent=${isSignIn ? "sign-in" : "sign-up"}`,
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An error occurred");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isSignIn && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
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
          // Handle email verification etc.
          setError("Email verification required. Please check your inbox.");
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSocialSignIn("oauth_google")}
            className="flex w-full items-center justify-center gap-3 cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
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
            <span>Google</span>
          </button>
          <button
            onClick={() => handleSocialSignIn("oauth_github")}
            className="flex w-full items-center justify-center cursor-pointer gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <Github className="h-5 w-5" />
            <span>GitHub</span>
          </button>
        </div>

        <div className="relative flex items-center py-4">
          <div className="grow border-t border-white/10"></div>
          <span className="mx-4 shrink text-sm text-slate-500">
            or continue with email
          </span>
          <div className="grow border-t border-white/10"></div>
        </div>

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
            <input
              id="password"
              type="password"
              required
              className="mt-1 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isSignIn && (
            <div>
              <label
                className="block text-sm font-medium text-slate-300"
                htmlFor="confirm-password"
              >
                Confirm Password
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
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {!isSignIn && <div id="clerk-captcha" />}
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

        <p className="text-center text-sm text-slate-500">
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
