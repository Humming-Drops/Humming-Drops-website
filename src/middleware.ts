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
  "/reset-password",
];

function isMatch(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
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

  // A server page found this signed cookie no longer valid: drop it instead of bouncing back.
  if (pathname === "/login" && request.nextUrl.searchParams.get("session") === "expired") {
    const response = NextResponse.next();
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
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
        : session.role === "customer"
          ? "/dashboard/overview"
          : "/admin";
    return NextResponse.redirect(new URL(safeTarget, request.url));
  }

  // 4. Admin Portal Protection: Completely hidden from unauthenticated visitors and standard customers
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLogin = pathname === "/admin/login";

  if (isAdminRoute) {
    if (isAdminLogin) {
      // If already signed in with staff / super_admin role, forward to target or /admin
      if (session && session.role !== "customer") {
        const redirectParam = request.nextUrl.searchParams.get("redirect_url");
        const safeTarget =
          redirectParam && isSafeRedirectUrl(redirectParam)
            ? redirectParam
            : "/admin";
        return NextResponse.redirect(new URL(safeTarget, request.url));
      }
      return NextResponse.next();
    }

    // Unauthenticated access to /admin or any /admin/* sub-page redirects to /admin/login
    const fullAdminPath = pathname + request.nextUrl.search;
    if (!session) {
      const adminLoginUrl = new URL("/admin/login", request.url);
      adminLoginUrl.searchParams.set("redirect_url", fullAdminPath);
      return NextResponse.redirect(adminLoginUrl);
    }

    // Standard subscribers/customers attempting to access admin portal are redirected to their dashboard
    if (session.role === "customer") {
      return NextResponse.redirect(new URL("/dashboard/overview", request.url));
    }
  }

  // 5. Gating for /subscribe: Unauthenticated visitors must sign in or register first
  if (!session && (pathname === "/subscribe" || pathname.startsWith("/subscribe/"))) {
    const planParam = request.nextUrl.searchParams.get("plan");
    const registerUrl = buildRegisterRedirectUrl(request.url, planParam);
    return NextResponse.redirect(registerUrl);
  }

  // Browsers send Origin on cross-site writes; refuse them (webhooks sign their own requests).
  if (pathname.startsWith("/api/") && pathname !== "/api/payments/webhook" && !["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ success: false, error: "Cross-origin request refused." }, { status: 403 });
    }
  }

  // 6. Enforce protection for dashboard, onboarding, and private APIs
  if (isMatch(pathname, PROTECTED_PREFIXES)) {
    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Authentication required." },
          { status: 401 }
        );
      }

      const fullSubpagePath = pathname + request.nextUrl.search;
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect_url", fullSubpagePath);
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
