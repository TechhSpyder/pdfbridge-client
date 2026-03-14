import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const isPublicRoute = (pathname: string) => {
  const publicPaths = [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/auth",
    "/api/health",
    "/pricing",
    "/template-gallery",
    "/docs",
    "/blog",
    "/legal",
    "/privacy",
    "/terms",
    "/monitoring",
    "/api/public",
    "/api/v1/convert", // Public conversion endpoint
    "/api/v1/jobs",    // Job status is public with ID
  ];
  return publicPaths.some(path => pathname.startsWith(path));
};

const RETURNING_COOKIE = "pdfbridge_returning";

export default async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

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
