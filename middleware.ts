import { NextResponse, type NextRequest } from "next/server";

const API_URL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";

async function getSessionFromAPI(request: NextRequest) {
  try {
    const rawCookie = request.headers.get("cookie") || "";
    // [SECURITY] Redacted cookie length and content from logs
    if (rawCookie) {
      const hasSession = rawCookie.includes("better-auth.session_token");
      console.log(`[MW] getSession: Cookie present? ${!!rawCookie}. Includes session? ${hasSession}`);
    }

    // Clone all browser headers so Better Auth's anti-hijacking (User-Agent/IP checks) pass
    const headers = new Headers(request.headers);
    headers.set("Content-Type", "application/json");
    headers.set("Cookie", rawCookie);
    headers.set("X-Forwarded-Host", request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000");

    // BEARER FALLBACK: Extract naked token from the signed/prefixed cookie string
    // This circumvents strict same-origin cookie validation rules internally in get-session
    const tokenMatch = rawCookie.match(/better-auth\.session_token=([^;]+)/);
    if (tokenMatch) {
      const fullValue = decodeURIComponent(tokenMatch[1]);
      const rawToken = fullValue.split('.')[0];
      headers.set("Authorization", `Bearer ${rawToken}`);
      console.log(`[MW] getSession: Injected Bearer Token Override (Masked)`);
    }

    const response = await fetch(`${API_URL}/api/auth/get-session`, {
      method: "GET",
      headers,
      cache: "no-store", // CRITICAL: Prevent stale session caching in the bouncer
    });
    
    console.log(`[MW] getSession: API Response Status: ${response.status}`);
    
    if (!response.ok) {
      const errText = await response.text();
      console.log(`[MW] getSession: API Error Body: ${errText}`);
      return null;
    }
    const data = await response.json();
    console.log(`[MW] getSession: API Success Data: User ID = ${data?.user?.id || "None"}`);
    return data?.user ? data : null;
  } catch (err: any) {
    console.log(`[MW] getSession: Fetch Failed Exception: ${err.message}`);
    return null;
  }
}

const isPublicRoute = (pathname: string) => {
  if (pathname === "/") return true;
  const publicPrefixes = [
    "/sign-in",
    "/sign-up",
    "/api/auth",
    "/api/health",
    "/pricing",
    "/compiler",
    "/template-gallery",
    "/docs",
    "/blog",
    "/legal",
    "/privacy",
    "/terms",
    "/monitoring",
    "/api/public",
    "/api/v1/process", // Public conversion endpoint
    "/api/v1/jobs", // Job status is public with ID
  ];
  return publicPrefixes.some((path) => pathname.startsWith(path));
};

const RETURNING_COOKIE = "pdfbridge_returning";

export default async function middleware(request: NextRequest) {
  const session = await getSessionFromAPI(request);

  const { pathname } = request.nextUrl;
  const isReturning = request.cookies.has(RETURNING_COOKIE);
  const isHome = pathname === "/";
  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  // 1. If user is logged in and trying to access root or auth, go to dashboard
  if (session && (isHome || isAuthPage)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Returning User Logic
  const shouldSkipRedirect = request.nextUrl.searchParams.get("redirect") === "false";
  if (!session && isHome && isReturning && !shouldSkipRedirect) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 3. First Timer Logic
  let response = NextResponse.next();
  if (isHome && !isReturning) {
    response.cookies.set(RETURNING_COOKIE, "true", {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
  }

  // 4. Protect private routes
  if (!session && !isPublicRoute(pathname) && !pathname.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
