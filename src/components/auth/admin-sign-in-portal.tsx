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
  LogOut,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { isSafeRedirectUrl } from "@/lib/auth-redirects";
import { useAuth } from "@/lib/auth/client";

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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-forest-700 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Operations Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/60 border border-forest-700/60 text-xs font-semibold text-emerald-400 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Operations Console</span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="mt-4 text-center font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Humming Drops Staff Access
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-stone-400">
          Bangalore Kitchen Dispatch &middot; Berrybeats Cafe &middot; MedCity Vitals
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl py-8 px-6 sm:px-10 shadow-2xl backdrop-blur">
          {/* Insufficient permissions notice if customer is logged in */}
          {isInsufficientCustomer ? (
            <div className="space-y-6">
              <div
                role="alert"
                className="rounded-xl border border-amber-500/40 bg-amber-950/40 p-4 text-amber-200 text-xs leading-relaxed space-y-2"
              >
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Insufficient Privileges</span>
                </div>
                <p>
                  You are signed in as <span className="font-mono text-white font-semibold">{user.email}</span>, which is a customer subscriber account and does not hold staff permissions for the Operations Console.
                </p>
              </div>

              <div className="space-y-2.5">
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  className="w-full h-11 border-stone-700 hover:bg-stone-800 text-stone-200 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out and switch to staff account</span>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className="w-full h-11 text-stone-400 hover:text-white text-xs font-semibold"
                >
                  <Link href="/dashboard/overview">
                    &larr; Return to Customer Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {error && (
                <div
                  role="alert"
                  className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 p-3.5 flex items-start gap-3 text-xs text-red-200 animate-in fade-in"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Staff Sign-in Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-email"
                    className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5"
                  >
                    Staff Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-700 bg-stone-950 text-white placeholder:text-stone-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Staff security credentials"
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-700 bg-stone-950 text-white placeholder:text-stone-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating staff credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Operations Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Developer Helper */}
              {process.env.NODE_ENV === "development" && (
              <div className="mt-6 pt-5 border-t border-stone-800 text-center">
                <div className="inline-flex items-center gap-1.5 text-[11px] text-stone-400">
                  <Terminal className="w-3.5 h-3.5 text-stone-500" />
                  <span>Default Admin: admin@hummingdrops.dev</span>
                </div>
              </div>
              )}
            </>
          )}

          {/* Customer Portal Link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-stone-200 transition"
            >
              &larr; Return to Humming Drops Main Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
