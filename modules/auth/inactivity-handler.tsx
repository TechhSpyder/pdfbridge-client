"use client";

import { useEffect, useRef } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const CHECK_INTERVAL = 60 * 1000; // Check every minute

export function InactivityHandler() {
  const { signOut, session } = useClerk();
  const router = useRouter();
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!session) return;

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    // Events to track user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("click", handleActivity);

    // Interval to check for inactivity
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivityRef.current > INACTIVITY_TIMEOUT) {
        console.log("Inactivity timeout reached. Logging out...");
        signOut(() => router.push("/sign-in"));
      }
    }, CHECK_INTERVAL);

    // Also monitor for server-side SESSION_EXPIRED
    // We wrap fetch to catch 401 SESSION_EXPIRED responses
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const response = await originalFetch.apply(this, args);

      // Skip for Turnstile/Security endpoints to avoid interference
      const url = typeof args[0] === "string" ? args[0] : "";
      if (
        url.includes("challenges.cloudflare.com") ||
        url.includes("/verify-turnstile")
      ) {
        return response;
      }

      if (response.status === 401) {
        try {
          const data = await response.clone().json();
          if (data.error === "SESSION_EXPIRED") {
            console.log("Session expired on server. Redirecting to sign-in...");
            signOut(() => router.push("/sign-in"));
          }
        } catch (e) {
          // Ignore non-JSON or other errors
        }
      }
      return response;
    };

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("click", handleActivity);
      clearInterval(interval);
      window.fetch = originalFetch;
    };
  }, [session, signOut, router]);

  return null;
}
