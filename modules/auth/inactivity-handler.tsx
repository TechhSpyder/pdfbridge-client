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
    // We wrap fetch ONLY for our own API calls to avoid breaking
    // third-party security challenges like Cloudflare Turnstile/PAT.
    const originalFetch = window.fetch;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    window.fetch = function (...args) {
      const url = typeof args[0] === "string" ? args[0] : "";
      const isInternalApi = apiUrl && url.includes(apiUrl);

      // If it's NOT our API, don't even add a .then() - return original promise immediately.
      // This is the most transparent way to pass through security/PAT handshakes.
      if (!isInternalApi || url.includes("/verify-turnstile")) {
        return originalFetch.apply(this, args);
      }

      // For our API requests, monitor for session expiration
      return originalFetch.apply(this, args).then(async (response) => {
        if (response.status === 401) {
          try {
            const data = await response.clone().json();
            if (data.error === "SESSION_EXPIRED") {
              console.log("Session expired. Redirecting to sign-in...");
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
