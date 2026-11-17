import { NextResponse, type NextRequest } from "next/server";
import {
  buildRegisterRedirectUrl,
  isSafeRedirectUrl,
} from "@/lib/auth-redirects";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/session";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/api/payments/order",
  "/api/payments/verify",
  "/api/customer",
  "/api/admin",
];

const AUTH_PREFIXES = [
  "/login",
  "/register",
  "/admin/login",
  "/forgot-password",
];

function isMatch(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Sanitize incoming redirect_url on auth routes to prevent open redirect exploits
  if (isMatch(pathname, AUTH_PREFIXES)) {
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

  // 2. Read and verify session token from cookies
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(sessionCookie);

  // 3. If authenticated user visits /register or /login, redirect forward
  if (session && (pathname === "/login" || pathname === "/register")) {
    const redirectParam = request.nextUrl.searchParams.get("redirect_url");
    const safeTarget =
      redirectParam && isSafeRedirectUrl(redirectParam)
        ? redirectParam
        : "/dashboard/overview";
    return NextResponse.redirect(new URL(safeTarget, request.url));
  }

  // 4. Gating for /subscribe: Unauthenticated visitors must sign in or register first
  if (!session && (pathname === "/subscribe" || pathname.startsWith("/subscribe/"))) {
    const planParam = request.nextUrl.searchParams.get("plan");
    const registerUrl = buildRegisterRedirectUrl(request.url, planParam);
    return NextResponse.redirect(registerUrl);
  }

  // 5. Enforce protection for dashboard, onboarding, and private APIs
  if (isMatch(pathname, PROTECTED_PREFIXES)) {
    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Authentication required." },
          { status: 401 }
        );
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based protection for /api/admin
    if (pathname.startsWith("/api/admin")) {
      if (session.role === "customer") {
        return NextResponse.json(
          { success: false, error: "Access denied. Administrator privileges required." },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
