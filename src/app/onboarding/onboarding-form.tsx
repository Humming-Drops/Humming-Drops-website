"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <Card className="p-6 space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-xs font-bold text-content-secondary">
            Email
          </label>
          <input
            id="email"
            type="email"
            disabled
            value={defaultEmail}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-line-subtle bg-muted/40 text-content-secondary"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="fullName" className="block text-xs font-bold text-content-secondary">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            minLength={2}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-line-subtle focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="block text-xs font-bold text-content-secondary">
            WhatsApp mobile number <span className="text-red-500">*</span>
          </label>
          <div className="relative flex">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-line-subtle bg-muted/40 text-content-secondary text-xs font-bold">
              +91
            </span>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98765 43210"
              className="w-full px-3 py-2.5 text-sm rounded-r-xl border border-line-subtle focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
        </div>

        {error ? <p className="text-xs text-red-600">{error}</p> : null}

        <Button type="submit" variant="primary" size="md" isLoading={isPending} className="w-full rounded-full">
          Continue
        </Button>
      </form>
    </Card>
  );
}
