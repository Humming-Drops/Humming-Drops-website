import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import {
  buildRegisterRedirectUrl,
  isSafeRedirectUrl,
} from "@/lib/auth-redirects";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/onboarding(.*)",
  "/api/payments/order",
  "/api/payments/verify",
  "/api/customer(.*)",
]);

const isSubscribeRoute = createRouteMatcher([
  "/subscribe(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/login(.*)",
  "/register(.*)",
]);

function hasConfiguredClerkKeys(): boolean {
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secKey = process.env.CLERK_SECRET_KEY;
  if (!pubKey || !secKey) return false;
  if (pubKey.includes("placeholder") || secKey.includes("placeholder")) return false;
  return true;
}

const clerkHandler = clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // 1. Sanitize incoming redirect_url on auth routes to prevent open redirect exploits
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

  // 3. Enforce existing protection for dashboard, admin, onboarding, and payment APIs
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  // Sanitize open-redirects on auth routes even without Clerk keys
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

  if (!hasConfiguredClerkKeys()) {
    // If Clerk keys are missing or placeholders in this deployment:
    // Keep public pages accessible, and gracefully guard protected routes.
    if (isProtectedRoute(request)) {
      return NextResponse.json(
        { error: "Authentication service not configured. Please set Clerk credentials in project environment variables." },
        { status: 503 }
      );
    }
    return NextResponse.next();
  }

  try {
    return await clerkHandler(request, event);
  } catch (error) {
    console.error("Clerk middleware invocation failed:", error);
    if (isProtectedRoute(request)) {
      return NextResponse.json(
        { error: "Authentication service unavailable." },
        { status: 503 }
      );
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|png|jpg|jpeg|gif|svg|webp|ico|mp4|webm|woff2?|ttf|map|json)).*)",
    "/(api|trpc)(.*)",
  ],
};
