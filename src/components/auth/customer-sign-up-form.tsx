"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  Loader2,
  ArrowRight,
  Check,
} from "lucide-react";
import { isSafeRedirectUrl } from "@/lib/auth-redirects";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/client";

export function CustomerSignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  const redirectParam = searchParams.get("redirect_url");
  const safeRedirectUrl =
    redirectParam && isSafeRedirectUrl(redirectParam)
      ? redirectParam
      : "/subscribe";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to create account. Please check your details.");
        return;
      }

      await refresh();
      router.push(safeRedirectUrl);
      router.refresh();
    } catch {
      setError("Unable to connect to registration service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-50 text-forest-800 border border-forest-200">
          Fresh Morning Starts
        </span>
        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
          Create Your Account
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Subscribe for fresh breakfast boxes delivered right to your doorstep in Bangalore.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50/80 p-4 flex items-start gap-3 text-sm text-red-800 animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Name Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
            >
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id="firstName"
                type="text"
                required
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#E2ECE4] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              required
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last"
              className="w-full px-3.5 py-3 rounded-xl border border-[#E2ECE4] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Email */}
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
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2ECE4] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
          >
            Mobile Number (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Phone className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2ECE4] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
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
          <p className="mt-1 text-[11px] text-stone-500">
            Must contain at least 8 characters.
          </p>
        </div>

        {/* Terms Agreement */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-stone-300 text-forest-700 focus:ring-forest-600 transition"
            />
            <span className="text-xs text-stone-600 leading-relaxed">
              I agree to the{" "}
              <Link href="/about" className="text-forest-800 underline font-semibold">
                Terms of Service
              </Link>
              , morning doorstep delivery guidelines, and{" "}
              <Link href="/medcity-smiles" className="text-forest-800 underline font-semibold">
                MedCity Smiles Health Program
              </Link>
              .
            </span>
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      {/* Switch to Sign In */}
      <div className="mt-8 pt-6 border-t border-[#E2ECE4] text-center">
        <p className="text-sm text-stone-600">
          Already have an account?{" "}
          <Link
            href={`/login${redirectParam ? `?redirect_url=${encodeURIComponent(redirectParam)}` : ""}`}
            className="font-bold text-forest-800 hover:text-forest-950 hover:underline transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
