import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/reset-password(.*)",
  "/dpa(.*)",
  "/insights(.*)",
  "/docs(.*)",
  "/privacy(.*)",
  "/terms(.*)",
]);

const RETURNING_COOKIE = "pdfbridge_returning";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;
  const isReturning = req.cookies.has(RETURNING_COOKIE);

  const isHome = pathname === "/";
  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  // 1. If user is logged in and trying to access root or auth, go to dashboard
  if (userId && (isHome || isAuthPage)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. Returning User Logic: If not logged in but has visited before,
  // redirect homepage to sign-in for a faster "back to work" flow.
  if (!userId && isHome && isReturning) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 3. First Timer Logic: If they are on the homepage, set the cookie
  // so their NEXT visit is recognized as "returning".
  let response = NextResponse.next();
  if (isHome && !isReturning) {
    response.cookies.set(RETURNING_COOKIE, "true", {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
  }

  // Protect all routes that are NOT public
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
