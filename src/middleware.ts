import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  buildRegisterRedirectUrl,
  isSafeRedirectUrl,
} from "@/lib/auth-redirects";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/api/payments/order",
  "/api/payments/verify",
]);

const isSubscribeRoute = createRouteMatcher([
  "/subscribe(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/login(.*)",
  "/register(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // 1. Sanitize incoming redirect_url on auth routes to prevent open redirect exploits
  if (isAuthRoute(request)) {
    const redirectParam = request.nextUrl.searchParams.get("redirect_url");
    if (redirectParam && !isSafeRedirectUrl(redirectParam)) {
      // Strip malicious external redirect_url parameter and redirect to clean auth page
      const cleanUrl = new URL(request.nextUrl.pathname, request.url);
      request.nextUrl.searchParams.forEach((val, key) => {
        if (key !== "redirect_url") {
          cleanUrl.searchParams.set(key, val);
        }
      });
      return NextResponse.redirect(cleanUrl);
    }

    // If an already authenticated customer visits /register, redirect them forward
    if (userId && request.nextUrl.pathname === "/register") {
      const safeTarget = redirectParam && isSafeRedirectUrl(redirectParam)
        ? redirectParam
        : "/subscribe";
      return NextResponse.redirect(new URL(safeTarget, request.url));
    }
  }

  // 2. Gating for /subscribe: Unauthenticated visitors must register or sign in first
  if (!userId && isSubscribeRoute(request)) {
    const planParam = request.nextUrl.searchParams.get("plan");
    const registerUrl = buildRegisterRedirectUrl(request.url, planParam);
    return NextResponse.redirect(registerUrl);
  }

  // 3. Enforce existing protection for dashboard, admin, and payment APIs
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|png|jpg|jpeg|gif|svg|webp|ico|mp4|webm|woff2?|ttf|map|json)).*)",
    "/(api|trpc)(.*)",
  ],
};

