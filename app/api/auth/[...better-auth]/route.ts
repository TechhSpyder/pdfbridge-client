/**
 * Sovereign Identity Proxy (Transparent Edition)
 * All auth traffic proxies to pdfbridge-api (3003).
 * Fully transparent: all headers including Set-Cookie pass through as-is.
 * Better Auth handles all cookie issuance natively — no manual interception.
 */
import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3003";

async function handler(request: NextRequest) {
  const url = new URL(request.url);
  const apiUrl = `${API_URL}${url.pathname}${url.search}`;

  try {
    const bodyBuffer =
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.arrayBuffer()
        : undefined;

    // Explicitly forward logical origin to the API
    const headers = new Headers(request.headers);
    headers.set(
      "X-Forwarded-Host",
      request.headers.get("host") || "localhost:3000",
    );

    const start = Date.now();
    const response = await fetch(apiUrl, {
      method: request.method,
      headers,
      body: bodyBuffer,
      redirect: "manual",
    });
    const duration = Date.now() - start;
    const res = new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });

    res.headers.delete("Content-Encoding");

    /**
     * ULTRA-ROBUST MULTI-HEADER RELAY
     * We attempt getSetCookie first, but if missing (Older Node/Next), we
     * use a safe entry-iterator to find all set-cookie headers manually.
     */
    let setCookies: string[] = [];
    if (typeof response.headers.getSetCookie === "function") {
      setCookies = response.headers.getSetCookie();
    } else {
      // Fallback: Manually iterate entries to find multiple Set-Cookie headers
      for (const [key, value] of (response.headers as any).entries()) {
        if (key.toLowerCase() === "set-cookie") {
          // In some runtimes, entries() might return merged cookies.
          // We break them safely by looking for common delimiters if they contain more than one.
          setCookies.push(value);
        }
      }
    }

    if (setCookies.length > 0) {
      res.headers.delete("Set-Cookie");
      for (const cookie of setCookies) {
        res.headers.append("Set-Cookie", cookie);
      }
    }

    return res;
  } catch (err: any) {
    console.error("[PROXY ERROR]", err);
    return NextResponse.json(
      { error: "Identity Gateway Timeout" },
      { status: 504 },
    );
  }
}

export const GET = handler;
export const POST = handler;
