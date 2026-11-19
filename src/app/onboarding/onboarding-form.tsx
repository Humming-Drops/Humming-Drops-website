"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AuthErrorAlert,
  authButtonClass,
  authInputClass,
  authLabelClass,
} from "@/components/auth/auth-shell";

export function OnboardingForm({ defaultEmail }: { defaultEmail: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/customer/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "profile", fullName, phone }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Something went wrong. Please try again.");
        }
        router.push("/dashboard/overview");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <AuthErrorAlert id="onboarding-error">
          <p>{error}</p>
        </AuthErrorAlert>
      ) : null}

      <div>
        <label htmlFor="email" className={authLabelClass}>
          Email
        </label>
        <input id="email" type="email" disabled value={defaultEmail} className={authInputClass} />
      </div>

      <div>
        <label htmlFor="fullName" className={authLabelClass}>
          Full name <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          required
          minLength={2}
          autoComplete="name"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "onboarding-error" : undefined}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
          className={authInputClass}
        />
      </div>

      <div>
        <label htmlFor="phone" className={authLabelClass}>
          WhatsApp mobile number <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-[#E2ECE4] bg-stone-50 text-stone-600 text-sm font-semibold">
            +91
          </span>
          <input
            id="phone"
            type="tel"
            required
            autoComplete="tel-national"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "onboarding-error" : undefined}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="98765 43210"
            className={cn(authInputClass, "rounded-l-none")}
          />
        </div>
      </div>

      <Button type="submit" isLoading={isPending} className={cn(authButtonClass, "mt-1")}>
        Continue
      </Button>
    </form>
  );
}
