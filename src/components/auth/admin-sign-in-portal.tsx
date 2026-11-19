"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  LogOut,
  Terminal,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { isSafeRedirectUrl } from "@/lib/auth-redirects";
import { useAuth } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import {
  AuthCard,
  AuthErrorAlert,
  AuthFooterRow,
  AuthHeader,
  FieldIcon,
  authButtonClass,
  authInputClass,
  authInputWithIconClass,
  authLabelClass,
  authLinkClass,
} from "@/components/auth/auth-shell";

export function AdminSignInPortal() {
  const { user, isSignedIn, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid staff credentials.");
        return;
      }

      if (data.user.role === "customer") {
        setError("Access Denied: Your account does not possess staff or administrator privileges.");
        return;
      }

      // Hard redirect to requested subpage or /admin
      const redirectParam = new URLSearchParams(window.location.search).get("redirect_url");
      const safeTarget =
        redirectParam && isSafeRedirectUrl(redirectParam)
          ? redirectParam
          : "/admin";
      window.location.href = safeTarget;
    } catch {
      setError("Unable to authenticate with operations console. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isInsufficientCustomer = isSignedIn && user?.role === "customer";

  return (
    <div className="min-h-screen bg-canvas flex justify-center items-start sm:items-center px-4 py-10 sm:py-16 selection:bg-forest-100 selection:text-forest-900">
      <div className="w-full max-w-md">
        <Link
          href="/"
          aria-label="Humming Drops Home"
          className="mx-auto mb-6 flex w-fit rounded-xl p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600"
        >
          <span className="relative block h-12 w-28">
            <Image
              src="/images/humming-drops-logo.png"
              alt="Humming Drops"
              fill
              sizes="112px"
              className="object-contain"
              priority
            />
          </span>
        </Link>

        <AuthCard>
          <p className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            Operations Console
          </p>
          <AuthHeader
            title="Humming Drops Staff Access"
            description="Bangalore Kitchen Dispatch · Berrybeats Cafe · MedCity Vitals"
          />

          {isInsufficientCustomer ? (
            <div className="space-y-6">
              <div
                role="alert"
                className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed space-y-2"
              >
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-700" aria-hidden="true" />
                  <span>Insufficient Privileges</span>
                </div>
                <p>
                  You are signed in as <span className="font-semibold break-all">{user.email}</span>, which is a customer subscriber account and does not hold staff permissions for the Operations Console.
                </p>
              </div>

              <div className="space-y-2">
                <Button onClick={() => logout()} className={authButtonClass}>
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span>Sign out and switch to staff account</span>
                </Button>

                <Link
                  href="/dashboard/overview"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-forest-800 hover:bg-forest-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Return to Customer Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <AuthErrorAlert id="admin-auth-error">
                  <p>{error}</p>
                </AuthErrorAlert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="admin-email" className={authLabelClass}>
                    Staff Email
                  </label>
                  <div className="relative">
                    <FieldIcon>
                      <Mail className="w-4 h-4" aria-hidden="true" />
                    </FieldIcon>
                    <input
                      id="admin-email"
                      type="email"
                      required
                      autoComplete="email"
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? "admin-auth-error" : undefined}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={cn(authInputClass, authInputWithIconClass)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="admin-password" className={authLabelClass}>
                    Password
                  </label>
                  <div className="relative">
                    <FieldIcon>
                      <Lock className="w-4 h-4" aria-hidden="true" />
                    </FieldIcon>
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? "admin-auth-error" : undefined}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Staff security credentials"
                      className={cn(authInputClass, authInputWithIconClass, "pr-12")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 w-12 flex items-center justify-center rounded-r-xl text-stone-400 hover:text-stone-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className={cn(authButtonClass, "mt-1")}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Authenticating staff credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Operations Console</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </form>

              {process.env.NODE_ENV === "development" && (
                <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-stone-500">
                  <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Default Admin: admin@hummingdrops.dev</span>
                </p>
              )}
            </>
          )}

          <AuthFooterRow>
            <Link href="/" className={cn(authLinkClass, "inline-flex items-center gap-1.5 py-2")}>
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Return to Humming Drops Main Website
            </Link>
          </AuthFooterRow>
        </AuthCard>
      </div>
    </div>
  );
}
