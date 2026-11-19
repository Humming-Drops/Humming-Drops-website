"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2ECE4] bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition";
const labelClass = "block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5";
const buttonClass =
  "w-full h-12 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 mt-2";
const linkClass =
  "font-bold text-forest-800 hover:text-forest-950 hover:underline transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 rounded";

function ErrorAlert({ id, message }: { id: string; message: string }) {
  return (
    <div
      id={id}
      role="alert"
      className="mb-6 rounded-2xl border border-red-200 bg-red-50/80 p-4 flex items-start gap-3 text-sm text-red-800"
    >
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

function SuccessAlert({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="mb-6 rounded-2xl border border-forest-200 bg-forest-50 p-4 flex items-start gap-3 text-sm text-forest-900"
    >
      <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

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
    <div className="w-full max-w-md mx-auto">
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
        Forgot your password?
      </h1>
      <p className="mt-2 mb-6 text-sm text-stone-600">
        Enter the email you signed up with and we will send you a link to choose a new password.
      </p>

      {error && <ErrorAlert id="forgot-error" message={error} />}
      {done ? (
        <SuccessAlert message={done} />
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className={labelClass}>
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
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "forgot-error" : undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className={buttonClass}>
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

      <p className="mt-8 pt-6 border-t border-[#E2ECE4] text-center text-sm text-stone-600">
        Remembered it?{" "}
        <Link href="/login" className={linkClass}>
          Back to sign in
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-stone-600">
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
      <div className="w-full max-w-md mx-auto">
        <h1 className="font-display text-2xl font-extrabold text-forest-950">Invalid reset link</h1>
        <p className="mt-2 text-sm text-stone-600">
          This link is missing its token.{" "}
          <Link href="/forgot-password" className={linkClass}>
            Request a new one
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
        Choose a new password
      </h1>
      <p className="mt-2 mb-6 text-sm text-stone-600">Use at least 8 characters.</p>

      {error && <ErrorAlert id="reset-error" message={error} />}
      {done ? (
        <>
          <SuccessAlert message="Your password has been updated." />
          <Link
            href="/login"
            className="block w-full h-12 leading-[3rem] text-center rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-bold text-sm"
          >
            Continue to sign in
          </Link>
        </>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {[
            { id: "password", label: "New Password", value: password, set: setPassword },
            { id: "confirm", label: "Confirm Password", value: confirm, set: setConfirm },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className={labelClass}>
                {f.label}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id={f.id}
                  type="password"
                  required
                  autoComplete="new-password"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "reset-error" : undefined}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
          <Button type="submit" disabled={loading} className={buttonClass}>
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
