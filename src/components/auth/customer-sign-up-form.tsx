"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignUp } from "@clerk/nextjs/legacy";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  ArrowRight,
  MailCheck,
  Check,
} from "lucide-react";
import { isSafeRedirectUrl } from "@/lib/auth-redirects";
import { Button } from "@/components/ui/button";

export function CustomerSignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectParam = searchParams.get("redirect_url");
  const safeRedirectUrl =
    redirectParam && isSafeRedirectUrl(redirectParam)
      ? redirectParam
      : "/subscribe";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Email verification state
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  // Initial sign up registration
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    if (!agreeTerms) {
      setError("Please accept the terms and morning delivery guidelines to proceed.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: email.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(safeRedirectUrl);
      } else {
        // Send email verification code
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setPendingVerification(true);
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ code?: string; message?: string; longMessage?: string }> };
      const primaryErr = clerkErr.errors?.[0];

      let friendlyMsg = primaryErr?.longMessage || primaryErr?.message || "Could not complete registration.";
      if (primaryErr?.code === "form_identifier_exists") {
        friendlyMsg = "An account with this email already exists. Please sign in instead.";
      } else if (primaryErr?.code === "form_password_pwned") {
        friendlyMsg = "This password was found in a public security breach. Please choose a more secure password.";
      }

      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  // Verify email code
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setError(null);
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push(safeRedirectUrl);
      } else {
        setError(`Verification status: ${completeSignUp.status}. Please check your code.`);
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ message?: string; longMessage?: string }> };
      const primaryErr = clerkErr.errors?.[0];
      setError(primaryErr?.longMessage || primaryErr?.message || "Invalid verification code. Please check your inbox.");
    } finally {
      setLoading(false);
    }
  };

  // Resend code handler
  const handleResendCode = async () => {
    if (!isLoaded || !signUp || resendCooldown > 0) return;
    try {
      setError(null);
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ message?: string; longMessage?: string }> };
      setError(clerkErr.errors?.[0]?.message || "Could not resend code. Please wait a moment.");
    }
  };

  // Google OAuth
  const handleGoogleSignUp = async () => {
    if (!isLoaded || !signUp) return;

    try {
      setError(null);
      setOauthLoading(true);
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: safeRedirectUrl,
      });
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ message?: string; longMessage?: string }> };
      setError(clerkErr.errors?.[0]?.longMessage || clerkErr.errors?.[0]?.message || "Could not initiate Google sign-up.");
      setOauthLoading(false);
    }
  };

  // Render Verification View
  if (pendingVerification) {
    return (
      <div className="w-full max-w-md mx-auto animate-in fade-in-50">
        <div className="mb-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-800 mb-3 shadow-2xs">
            <MailCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="font-display text-2xl font-extrabold text-forest-950 tracking-tight">
            Check your inbox
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            We sent a 6-digit confirmation code to{" "}
            <span className="font-semibold text-forest-900">{email}</span>.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50/80 flex items-start gap-3 text-sm text-red-900"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="flex-1 leading-snug">{error}</p>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="verification-code" className="block text-xs font-semibold text-stone-800 text-center">
              Enter 6-digit code
            </label>
            <input
              id="verification-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="one-time-code"
              required
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full py-3 px-4 rounded-xl border border-stone-200 bg-white text-center font-mono text-2xl tracking-[0.35em] text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isLoaded || loading || code.length < 6}
            className="w-full justify-center min-h-[48px] text-base font-bold shadow-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Verifying code...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Activate Account &amp; Continue
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3 text-xs text-stone-500">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendCooldown > 0}
            className="font-semibold text-forest-800 hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Didn't receive a code? Click to resend"}
          </button>
          <button
            type="button"
            onClick={() => setPendingVerification(false)}
            className="text-stone-400 hover:text-stone-700"
          >
            Entered the wrong email? Edit details
          </button>
        </div>
      </div>
    );
  }

  // Render Account Creation View
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-50 text-forest-800 border border-forest-200">
          Morning Wellness Club
        </span>
        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Join Bangalore&apos;s premier fresh breakfast &amp; MedCity Smiles health community.
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

      {/* Google Sign-Up One-Click */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
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
        <span>{oauthLoading ? "Connecting to Google..." : "Sign up with Google"}</span>
      </button>

      {/* Divider */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="w-full border-t border-stone-200" />
        <span className="absolute bg-[#FDFCF7] px-3 text-xs font-medium uppercase tracking-wider text-stone-400">
          or register with email
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Name Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="reg-first-name" className="block text-xs font-semibold text-stone-800">
              First name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <User className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <input
                id="reg-first-name"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ananya"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="reg-last-name" className="block text-xs font-semibold text-stone-800">
              Last name
            </label>
            <input
              id="reg-last-name"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Sharma"
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Email field */}
        <div className="space-y-1.5">
          <label htmlFor="reg-email" className="block text-xs font-semibold text-stone-800">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Mail className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="reg-email"
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
          <label htmlFor="reg-password" aria-label="Password" className="block text-xs font-semibold text-stone-800">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
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
          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-stone-500">
            <span
              className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full ${
                password.length >= 8 ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-400"
              }`}
            >
              <Check className="w-2.5 h-2.5" />
            </span>
            <span>Must be at least 8 characters</span>
          </div>
        </div>

        {/* Terms agreement checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600 select-none">
            <input
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-stone-300 text-brand-primary focus:ring-brand-primary"
            />
            <span>
              I agree to Humming Drops&apos;{" "}
              <Link href="/about" className="font-semibold text-forest-800 hover:underline">
                fresh delivery terms
              </Link>{" "}
              and MedCity Smiles preventative healthcare guidelines.
            </span>
          </label>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isLoaded || loading || oauthLoading}
          className="w-full justify-center min-h-[48px] text-base font-bold shadow-sm mt-3"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Creating account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Create Account &amp; Continue
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          )}
        </Button>
      </form>

      {/* Switch to Login */}
      <div className="mt-8 pt-6 border-t border-stone-200 text-center">
        <p className="text-xs text-stone-600">
          Already have an account?{" "}
          <Link
            href={
              redirectParam
                ? `/login?redirect_url=${encodeURIComponent(safeRedirectUrl)}`
                : "/login"
            }
            className="font-bold text-forest-800 hover:text-forest-950 underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
