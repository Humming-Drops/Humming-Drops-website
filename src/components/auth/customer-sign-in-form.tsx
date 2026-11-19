"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { isSafeRedirectUrl } from "@/lib/auth-redirects";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import {
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
    <div className="w-full">
      <AuthHeader
        title="Welcome back"
        description="Sign in to manage your morning breakfast box and MedCity Smiles vitals."
      />

      {error && (
        <AuthErrorAlert id="auth-error">
          <p>{error}</p>
        </AuthErrorAlert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className={authLabelClass}>
            Email Address
          </label>
          <div className="relative">
            <FieldIcon>
              <Mail className="w-4 h-4" aria-hidden="true" />
            </FieldIcon>
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
              className={cn(authInputClass, authInputWithIconClass)}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className={cn(authLabelClass, "mb-0")}>
              Password
            </label>
            <Link
              href="/forgot-password"
              className={cn(authLinkClass, "text-sm py-1 -my-1")}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <FieldIcon>
              <Lock className="w-4 h-4" aria-hidden="true" />
            </FieldIcon>
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

      <AuthFooterRow>
        New to Humming Drops?{" "}
        <Link
          href={`/register${redirectParam ? `?redirect_url=${encodeURIComponent(redirectParam)}` : ""}`}
          className={authLinkClass}
        >
          Create an account
        </Link>
      </AuthFooterRow>

      <p className="mt-6 text-center text-xs text-stone-500">
        Curated with CARE by Berrybeats Cafe &amp; MedCity Health Labs
      </p>
    </div>
  );
}
