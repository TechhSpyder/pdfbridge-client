/**
 * Server-side auth helper for the Next.js client.
 *
 * The client app does NOT run its own Better-Auth instance with a Prisma adapter.
 * Sessions are managed entirely by the pdfbridge-api server.
 * This module provides a helper to retrieve the session by proxying to the API.
 */
import { cookies } from "next/headers";
import { headers as nextHeaders } from "next/headers";

const API_URL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";

export type SessionUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  image?: string;
  role?: string;
};

export type Session = {
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: string;
  };
  user: SessionUser;
} | null;

/**
 * Fetches the current session from the API server.
 * For use in Next.js Server Components and layouts.
 */
export async function getServerSession(): Promise<Session> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const requestHeaders = await nextHeaders();
    const headers = new Headers(requestHeaders);
    headers.set("Cookie", cookieHeader);
    headers.set("Content-Type", "application/json");
    headers.set(
      "X-Forwarded-Host",
      requestHeaders.get("x-forwarded-host") ||
        requestHeaders.get("host") ||
        "localhost:3000",
    );

    // Bearer fallback for environments where cookie-only session validation is strict.
    const tokenMatch =
      cookieHeader.match(/better-auth\.session_token=([^;]+)/) ||
      cookieHeader.match(/__Secure-better-auth\.session_token=([^;]+)/);
    if (tokenMatch) {
      const fullValue = decodeURIComponent(tokenMatch[1]);
      const rawToken = fullValue.split(".")[0];
      headers.set("Authorization", `Bearer ${rawToken}`);
    }

    const response = await fetch(`${API_URL}/api/auth/get-session`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`[AUTH] getServerSession failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    // Better-Auth returns { session, user } or null
    if (!data || !data.user) return null;
    return data;
  } catch (err: any) {
    console.error("[AUTH] getServerSession error:", err.message);
    return null;
  }
}

/**
 * Legacy export for any code that still references `auth`.
 * Only the getServerSession function above should be used in new code.
 */
export const auth = {
  api: {
    getSession: async ({ headers: _headers }: { headers: any }) => {
      return getServerSession();
    },
  },
};
