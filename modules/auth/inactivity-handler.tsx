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
    // We wrap fetch to catch 401 SESSION_EXPIRED responses.
    // IMPORTANT: We use a non-async function here to return the original promise
    // immediately for security/Turnstile endpoints, avoiding any PAT interference.
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const url = typeof args[0] === "string" ? args[0] : "";

      // If it's a security/Turnstile URL, return original promise immediately
      if (
        url.includes("challenges.cloudflare.com") ||
        url.includes("/verify-turnstile")
      ) {
        return originalFetch.apply(this, args);
      }

      // For other requests, handle the response
      return originalFetch.apply(this, args).then(async (response) => {
        if (response.status === 401) {
          try {
            const data = await response.clone().json();
            if (data.error === "SESSION_EXPIRED") {
              console.log(
                "Session expired on server. Redirecting to sign-in...",
              );
              signOut(() => router.push("/sign-in"));
            }
          } catch (e) {
            // Ignore non-JSON or other errors
          }
        }
        return response;
      });
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
