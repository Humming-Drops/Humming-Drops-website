"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AuthErrorAlert,
  AuthFooterRow,
  AuthHeader,
  AuthSuccessAlert,
  FieldIcon,
  authButtonClass,
  authInputClass,
  authInputWithIconClass,
  authLabelClass,
  authLinkClass,
} from "@/components/auth/auth-shell";

async function postJson(url: string, body: unknown): Promise<{ ok: boolean; data: any }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON error body */
  }
  return { ok: res.ok && data.success, data };
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { ok, data } = await postJson("/api/auth/forgot-password", { email: email.trim() });
      if (!ok) setError(data.error || "Something went wrong. Please try again.");
      else setDone(data.message);
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <AuthHeader
        title="Forgot your password?"
        description="Enter the email you signed up with and we will send you a link to choose a new password."
      />

      {error && (
        <AuthErrorAlert id="forgot-error">
          <p>{error}</p>
        </AuthErrorAlert>
      )}
      {done ? (
        <AuthSuccessAlert>
          <p>{done}</p>
        </AuthSuccessAlert>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
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
                autoComplete="email"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "forgot-error" : undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={cn(authInputClass, authInputWithIconClass)}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className={cn(authButtonClass, "mt-1")}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Sending...</span>
              </>
            ) : (
              <span>Send reset link</span>
            )}
          </Button>
        </form>
      )}

      <AuthFooterRow>
        Remembered it?{" "}
        <Link href="/login" className={authLinkClass}>
          Back to sign in
        </Link>
      </AuthFooterRow>
      <p className="mt-6 text-center text-xs text-stone-500">
        Need help? Call or WhatsApp 8618902810 · hummingdrops@gmail.com
      </p>
    </div>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { ok, data } = await postJson("/api/auth/reset-password", { token, password });
      if (!ok) setError(data.error || "Something went wrong. Please try again.");
      else setDone(true);
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full">
        <AuthHeader
          className="mb-0"
          title="Invalid reset link"
          description={
            <>
              This link is missing its token.{" "}
              <Link href="/forgot-password" className={authLinkClass}>
                Request a new one
              </Link>
              .
            </>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <AuthHeader title="Choose a new password" description="Use at least 8 characters." />

      {error && (
        <AuthErrorAlert id="reset-error">
          <p>{error}</p>
        </AuthErrorAlert>
      )}
      {done ? (
        <>
          <AuthSuccessAlert>
            <p>Your password has been updated.</p>
          </AuthSuccessAlert>
          <Link
            href="/login"
            className={cn(authButtonClass, "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2")}
          >
            Continue to sign in
          </Link>
        </>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {[
            { id: "password", label: "New Password", value: password, set: setPassword },
            { id: "confirm", label: "Confirm Password", value: confirm, set: setConfirm },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className={authLabelClass}>
                {f.label}
              </label>
              <div className="relative">
                <FieldIcon>
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </FieldIcon>
                <input
                  id={f.id}
                  type="password"
                  required
                  autoComplete="new-password"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "reset-error" : undefined}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className={cn(authInputClass, authInputWithIconClass)}
                />
              </div>
            </div>
          ))}
          <Button type="submit" disabled={loading} className={cn(authButtonClass, "mt-1")}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Update password</span>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
