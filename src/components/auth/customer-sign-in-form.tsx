"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { isSafeRedirectUrl } from "@/lib/auth-redirects";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/client";

export function CustomerSignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  const redirectParam = searchParams.get("redirect_url");
  const safeRedirectUrl = redirectParam && isSafeRedirectUrl(redirectParam)
    ? redirectParam
    : "/dashboard/overview";

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
        setError(data.error || "Invalid email or password.");
        return;
      }

      await refresh();
      router.push(safeRedirectUrl);
      router.refresh();
    } catch {
      setError("Unable to connect to authentication service. Please try again.");
    } finally {
      setLoading(false);
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
          id="auth-error"
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50/80 p-4 flex items-start gap-3 text-sm text-red-800 animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Mail className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="email"
              type="email"
              required
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "auth-error" : undefined}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2ECE4] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-forest-700 hover:text-forest-900 transition"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "auth-error" : undefined}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#E2ECE4] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      {/* Switch to Sign Up */}
      <div className="mt-8 pt-6 border-t border-[#E2ECE4] text-center">
        <p className="text-sm text-stone-600">
          New to Humming Drops?{" "}
          <Link
            href={`/register${redirectParam ? `?redirect_url=${encodeURIComponent(redirectParam)}` : ""}`}
            className="font-bold text-forest-800 hover:text-forest-950 hover:underline transition"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* Security & Partner Footnote */}
      <div className="mt-8 text-center">
        <p className="text-xs text-stone-600">
          Curated with CARE by Berrybeats Cafe &amp; MedCity Health Labs
        </p>
      </div>
    </div>
  );
}
