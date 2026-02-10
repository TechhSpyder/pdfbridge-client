import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const isHomeOrAuth =
    req.nextUrl.pathname === "/" ||
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up");

  // If user is logged in and trying to access the root homepage or auth pages, redirect to dashboard
  if (userId && isHomeOrAuth) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // Protect all routes that are NOT public
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
