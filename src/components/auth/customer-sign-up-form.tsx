"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { isSafeRedirectUrl } from "@/lib/auth-redirects";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/client";
import { isValidIndianPhone, normalizePhone } from "@/lib/sanitization";
import { cn } from "@/lib/utils";
import {
  AuthErrorAlert,
  AuthFooterRow,
  AuthHeader,
  FieldIcon,
  authButtonClass,
  authFieldErrorClass,
  authHintClass,
  authInputClass,
  authInputWithIconClass,
  authLabelClass,
  authLinkClass,
} from "@/components/auth/auth-shell";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const invalid = (field: string) => (fieldErrors[field] ? true : undefined);
  const describedBy = (field: string) => (fieldErrors[field] ? `${field}-error` : undefined);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const found: Record<string, string> = {};
    if (!firstName.trim()) found.firstName = "Enter your first name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) found.email = "Enter a valid email address.";
    if (phone.trim() && !isValidIndianPhone(normalizePhone(phone))) found.phone = "Enter a valid 10-digit Indian mobile number, or leave it blank.";
    if (password.length < 8) found.password = "Password must be at least 8 characters long.";
    if (!agreeTerms) found.terms = "Please accept the terms to continue.";

    setFieldErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      setError(null);
      const targetId = firstInvalid === "terms" ? "agreeTerms" : firstInvalid;
      requestAnimationFrame(() => document.getElementById(targetId)?.focus());
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

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        const message = data.error || "Failed to create account. Please check your details.";
        if (data.field === "phone" || data.field === "email") {
          setFieldErrors({ [data.field]: message });
          requestAnimationFrame(() => document.getElementById(data.field)?.focus());
        } else {
          setError(message);
        }
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
    <div className="w-full">
      <AuthHeader
        title="Create Your Account"
        description="Subscribe for fresh breakfast boxes delivered right to your doorstep in Bangalore."
      />

      {error && (
        <AuthErrorAlert>
          <p>{error}</p>
        </AuthErrorAlert>
      )}

      {Object.keys(fieldErrors).length > 0 && (
        <AuthErrorAlert>
          <p className="font-bold">
            {Object.keys(fieldErrors).length === 1 ? "Please fix this field:" : "Please fix the following:"}
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {Object.entries(fieldErrors).map(([field, message]) => (
              <li key={field}>
                <a href={`#${field === "terms" ? "agreeTerms" : field}`} className="underline font-semibold">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </AuthErrorAlert>
      )}

      <form onSubmit={handleSignUp} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-3">
          <div>
            <label htmlFor="firstName" className={authLabelClass}>
              First Name
            </label>
            <input
              id="firstName"
              aria-invalid={invalid("firstName")}
              aria-describedby={describedBy("firstName")}
              type="text"
              required
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First"
              className={authInputClass}
            />
            <FieldError field="firstName" errors={fieldErrors} />
          </div>

          <div>
            <label htmlFor="lastName" className={authLabelClass}>
              Last Name <span className="font-normal text-stone-500">(Optional)</span>
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last"
              className={authInputClass}
            />
          </div>
        </div>

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
              aria-invalid={invalid("email")}
              aria-describedby={describedBy("email")}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={cn(authInputClass, authInputWithIconClass)}
            />
          </div>
          <FieldError field="email" errors={fieldErrors} />
        </div>

        <div>
          <label htmlFor="phone" className={authLabelClass}>
            Mobile Number (Optional)
          </label>
          <div className="relative">
            <FieldIcon>
              <Phone className="w-4 h-4" aria-hidden="true" />
            </FieldIcon>
            <input
              id="phone"
              aria-invalid={invalid("phone")}
              aria-describedby={describedBy("phone")}
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className={cn(authInputClass, authInputWithIconClass)}
            />
          </div>
          <FieldError field="phone" errors={fieldErrors} />
        </div>

        <div>
          <label htmlFor="password" className={authLabelClass}>
            Password
          </label>
          <div className="relative">
            <FieldIcon>
              <Lock className="w-4 h-4" aria-hidden="true" />
            </FieldIcon>
            <input
              id="password"
              aria-invalid={invalid("password")}
              aria-describedby={fieldErrors.password ? "password-error" : "password-hint"}
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
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
          {fieldErrors.password ? (
            <FieldError field="password" errors={fieldErrors} />
          ) : (
            <p id="password-hint" className={authHintClass}>
              Must contain at least 8 characters.
            </p>
          )}
        </div>

        <div className="flex items-start gap-3">
          <input
            id="agreeTerms"
            type="checkbox"
            aria-invalid={invalid("terms")}
            aria-describedby={describedBy("terms")}
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-stone-300 text-forest-700 focus:ring-forest-600 transition cursor-pointer"
          />
          <label htmlFor="agreeTerms" className="text-sm text-stone-600 leading-relaxed cursor-pointer">
            I agree to the{" "}
            <Link href="/terms" target="_blank" rel="noopener" className={cn(authLinkClass, "underline")}>
              Terms of Service
            </Link>
            ,{" "}
            <Link href="/privacy" target="_blank" rel="noopener" className={cn(authLinkClass, "underline")}>
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/medcity-smiles" target="_blank" rel="noopener" className={cn(authLinkClass, "underline")}>
              MedCity Smiles Health Program
            </Link>
            .
          </label>
        </div>
        <FieldError field="terms" errors={fieldErrors} />

        <Button type="submit" disabled={loading} className={cn(authButtonClass, "mt-1")}>
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

      <AuthFooterRow>
        Already have an account?{" "}
        <Link
          href={`/login${redirectParam ? `?redirect_url=${encodeURIComponent(redirectParam)}` : ""}`}
          className={authLinkClass}
        >
          Sign in
        </Link>
      </AuthFooterRow>
    </div>
  );
}

function FieldError({ field, errors }: { field: string; errors: Record<string, string> }) {
  if (!errors[field]) return null;
  return (
    <p id={`${field}-error`} className={authFieldErrorClass}>
      {errors[field]}
    </p>
  );
}
