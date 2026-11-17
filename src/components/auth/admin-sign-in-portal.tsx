"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { useSignIn } from "@clerk/nextjs/legacy";
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

export function AdminSignInPortal() {
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignInLoaded || !signIn) return;

    setError(null);
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Full page reload so server-side AdminLayout re-evaluates isStaffUser()
        window.location.href = "/admin";
      } else {
        setError(`Staff sign-in status: ${result.status}. Additional authentication required.`);
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ code?: string; message?: string; longMessage?: string }> };
      const primaryErr = clerkErr.errors?.[0];

      let msg = primaryErr?.longMessage || primaryErr?.message || "Invalid staff credentials.";
      if (primaryErr?.code === "form_identifier_not_found") {
        msg = "No account found with this staff email.";
      } else if (primaryErr?.code === "form_password_incorrect") {
        msg = "Incorrect password. Please verify your staff credentials.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isSignInLoaded || !signIn) return;

    try {
      setError(null);
      setOauthLoading(true);
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/admin",
      });
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ message?: string; longMessage?: string }> };
      setError(clerkErr.errors?.[0]?.longMessage || clerkErr.errors?.[0]?.message || "Google sign-in could not be initiated.");
      setOauthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-forest-700 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Operations Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/60 border border-forest-700/60 text-xs font-semibold text-emerald-400 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Humming Drops Operations &amp; Staff</span>
          </div>
        </div>

        <h1 className="mt-4 text-center font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Control Center Gateway
        </h1>
        <p className="mt-2 text-center text-xs sm:text-sm text-stone-400 max-w-sm mx-auto">
          Restricted administrative access for logistics dispatch, kitchen operations, clinical nutritionists, and administrators.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          {/* State A: User is signed in with Clerk, but lacks staff permissions */}
          {isUserLoaded && isSignedIn ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm space-y-2">
                <div className="flex items-center gap-2 font-semibold text-amber-300">
                  <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Access Permission Required</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  You are authenticated as <strong className="text-white">{userEmail}</strong>, but this account is currently registered as a customer and has not been granted operational staff privileges.
                </p>
              </div>

              {/* Developer Seed Instructions */}
              <div className="p-3.5 rounded-xl border border-stone-800 bg-black/40 text-xs text-stone-400 space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-stone-300">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Need Admin Access in Local Development?</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Run this command in your project terminal to grant <code className="text-emerald-400">super_admin</code>:
                </p>
                <pre className="p-2 rounded bg-stone-950 font-mono text-[11px] text-emerald-300 overflow-x-auto select-all">
                  npm run db:seed-admin -- {userEmail || "you@example.com"}
                </pre>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  asChild
                  className="w-full justify-center min-h-[44px] text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <Link href="/dashboard/overview">
                    <span>Go to Customer Dashboard</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-800 text-xs font-semibold text-stone-300 hover:bg-stone-700 active:bg-stone-600 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out &amp; switch account</span>
                </button>
              </div>
            </div>
          ) : (
            /* State B: Unauthenticated staff login form */
            <div className="space-y-6">
              {error && (
                <div
                  role="alert"
                  className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="flex-1 text-xs leading-relaxed">{error}</p>
                </div>
              )}

              {/* Google Workspace SSO */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={!isSignInLoaded || loading || oauthLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-800/80 text-xs font-semibold text-stone-200 hover:bg-stone-700/80 active:bg-stone-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-60"
              >
                {oauthLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>Sign in with Google Workspace</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-stone-800" />
                <span className="absolute bg-stone-900 px-3 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  or staff credentials
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="admin-email" className="block text-xs font-semibold text-stone-300">
                    Staff Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="staff@hummingdrops.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-800 bg-stone-950 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="admin-password" aria-label="Password" className="block text-xs font-semibold text-stone-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-800 bg-stone-950 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!isSignInLoaded || loading || oauthLoading}
                  className="w-full justify-center min-h-[44px] text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white mt-2 shadow-sm"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authenticating staff...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In to Operations Console
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-stone-500 hover:text-stone-300 transition"
          >
            &larr; Return to Humming Drops Website
          </Link>
        </div>
      </div>
    </div>
  );
}
