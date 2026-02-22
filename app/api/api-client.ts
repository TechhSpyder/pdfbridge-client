"use client";

import { useAuth } from "@clerk/nextjs";

export const useApiClient = () => {
  const { getToken } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const request = async (path: string, options: RequestInit = {}) => {
    const token = await getToken();
    // Get region hint from browser timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = new Date().getTimezoneOffset(); // -60 for UTC+1
    const regionHint =
      tz.includes("Lagos") || tz.includes("Africa/") || offset === -60
        ? "NG"
        : "US";

    const headers: HeadersInit = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Client-Region": regionHint,
    };

    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(error.message || error.error || "Request failed");
    }

    return response.json();
  };

  return {
    get: (path: string) => request(path, { method: "GET" }),
    post: (path: string, body: any) =>
      request(path, { method: "POST", body: JSON.stringify(body) }),
    patch: (path: string, body: any) =>
      request(path, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (path: string) => request(path, { method: "DELETE" }),
  };
};
