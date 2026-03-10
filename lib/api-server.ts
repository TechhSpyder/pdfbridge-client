import { headers } from "next/headers";

export async function getSeverApiClient() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";

  const request = async (path: string, options: RequestInit = {}) => {
    const headerList = await headers();
    const cookie = headerList.get("cookie") || "";

    const headersInit: HeadersInit = {
      ...options.headers,
      "Content-Type": "application/json",
      "Cookie": cookie, // Forward cookies to backend
    };

    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: headersInit,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || error.message || "Request failed");
    }

    return response.json();
  };

  return {
    get: (path: string) => request(path, { method: "GET" }),
    post: (path: string, body?: any) => 
      request(path, { 
        method: "POST", 
        body: body ? JSON.stringify(body) : undefined 
      }),
  };
}
