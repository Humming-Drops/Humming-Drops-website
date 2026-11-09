import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isSafeRedirectUrl } from "@/lib/auth-redirects";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/onboarding(.*)",
  "/api/payments/order",
  "/api/payments/verify",
  "/api/customer(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/login(.*)",
  "/register(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // Prevent open-redirect exploits on login/register routes
  if (isAuthRoute(request)) {
    const redirectParam = request.nextUrl.searchParams.get("redirect_url");
    if (redirectParam && !isSafeRedirectUrl(redirectParam)) {
      const cleanUrl = new URL(request.nextUrl.pathname, request.url);
      request.nextUrl.searchParams.forEach((val, key) => {
        if (key !== "redirect_url") {
          cleanUrl.searchParams.set(key, val);
        }
      });
      return NextResponse.redirect(cleanUrl);
    }
  }

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
