import { auth } from "@clerk/nextjs/server";

export async function getSeverApiClient() {
  const { getToken } = await auth();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const request = async (path: string, options: RequestInit = {}) => {
    const token = await getToken();

    const headers: HeadersInit = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  };

  return {
    get: (path: string) => request(path, { method: "GET" }),
  };
}
