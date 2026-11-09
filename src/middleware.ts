import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
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

function hasConfiguredClerkKeys(): boolean {
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secKey = process.env.CLERK_SECRET_KEY;
  if (!pubKey || !secKey) return false;
  if (pubKey.includes("placeholder") || secKey.includes("placeholder")) return false;
  return true;
}

const clerkHandler = clerkMiddleware(async (auth, request) => {
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
