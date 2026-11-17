"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn } from "@clerk/nextjs/legacy";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { isSafeRedirectUrl } from "@/lib/auth-redirects";
import { Button } from "@/components/ui/button";

export function CustomerSignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectParam = searchParams.get("redirect_url");
  const safeRedirectUrl = redirectParam && isSafeRedirectUrl(redirectParam)
    ? redirectParam
    : "/dashboard/overview";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setError(null);
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(safeRedirectUrl);
      } else {
        setError(
          `Sign-in status: ${result.status}. Additional authentication required. Please check your email or contact support.`
        );
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ code?: string; message?: string; longMessage?: string }> };
      const primaryErr = clerkErr.errors?.[0];

      let friendlyMsg = primaryErr?.longMessage || primaryErr?.message || "Invalid email or password.";
      if (primaryErr?.code === "form_identifier_not_found") {
        friendlyMsg = "No account found with this email. Please check your spelling or sign up below.";
      } else if (primaryErr?.code === "form_password_incorrect") {
        friendlyMsg = "Incorrect password. Please try again or use the reset link.";
      }

      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded || !signIn) return;

    try {
      setError(null);
      setOauthLoading(true);
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: safeRedirectUrl,
      });
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ message?: string; longMessage?: string }> };
      setError(clerkErr.errors?.[0]?.longMessage || clerkErr.errors?.[0]?.message || "Could not initiate Google sign-in.");
      setOauthLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-50 text-forest-800 border border-forest-200">
          Subscriber Portal
        </span>
        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Sign in to manage your morning breakfast box and MedCity Smiles vitals.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50/80 flex items-start gap-3 text-sm text-red-900 animate-in fade-in-50"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="flex-1 leading-snug">{error}</p>
        </div>
      )}

      {/* Google OAuth One-Click */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={!isLoaded || loading || oauthLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm font-semibold text-stone-800 hover:bg-stone-50 active:bg-stone-100 transition shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {oauthLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-stone-600" aria-hidden="true" />
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
        <span>{oauthLoading ? "Connecting to Google..." : "Continue with Google"}</span>
      </button>

      {/* Divider */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="w-full border-t border-stone-200" />
        <span className="absolute bg-[#FDFCF7] px-3 text-xs font-medium uppercase tracking-wider text-stone-400">
          or sign in with email
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email field */}
        <div className="space-y-1.5">
          <label htmlFor="customer-email" className="block text-xs font-semibold text-stone-800">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Mail className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="customer-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="customer-password" aria-label="Password" className="block text-xs font-semibold text-stone-800">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-forest-700 hover:text-forest-900 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="customer-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isLoaded || loading || oauthLoading}
          className="w-full justify-center min-h-[48px] text-base font-bold shadow-sm mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Sign In to Humming Drops
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          )}
        </Button>
      </form>

      {/* Switch to Register */}
      <div className="mt-8 pt-6 border-t border-stone-200 text-center space-y-3">
        <p className="text-xs text-stone-600">
          New to Humming Drops?{" "}
          <Link
            href={
              redirectParam
                ? `/register?redirect_url=${encodeURIComponent(safeRedirectUrl)}`
                : "/register"
            }
            className="font-bold text-forest-800 hover:text-forest-950 underline"
          >
            Create an account
          </Link>
        </p>

        {/* Admin Portal Gateway Link */}
        <div className="pt-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-forest-800 transition"
          >
            <span>Humming Drops Staff or Operations?</span>
            <span className="font-semibold underline">Access Admin Portal &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
