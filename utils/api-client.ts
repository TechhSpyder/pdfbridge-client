"use client";

export const useApiClient = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const request = async (path: string, options: RequestInit = {}) => {
    // Better-Auth uses cookies for session management.
    // We must pass 'include' to ensure cross-origin cookies are sent (if API is on different port/domain)
    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
    } as any;

    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      credentials: "include", // Essential for Better-Auth cookies
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));

      // Handle Session Expired
      if (error.error === "Session Expired" || response.status === 401) {
        // Redirect to sign-in if session is invalid
        if (typeof window !== "undefined") {
          window.location.href = `/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`;
        }
        return;
      }

      throw new Error(error.message || error.error || "Request failed");
    }

    return response.json();
  };

  return {
    get: (path: string) => request(path, { method: "GET" }),
    post: (path: string, body: any) =>
      request(path, { method: "POST", body: JSON.stringify(body) }),
    put: (path: string, body: any) =>
      request(path, { method: "PUT", body: JSON.stringify(body) }),
    delete: (path: string) => request(path, { method: "DELETE" }),
  };
};
