"use client";

import { useEffect, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";

interface AccountData {
  user: {
    email: string;
    phone: string;
    profile?: { fullName: string };
  };
  subscriptions: Array<{
    subscription: { planId: string; leadReferenceCode: string; status: string };
    address?: { area: string; city: string; pincode: string };
  }>;
}

export default function DashboardSettingsPage() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/customer/me")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load account.");
        setAccount(data);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  if (error) return <p className="p-6 text-sm text-red-700">{error}</p>;
  if (!account) return <p className="p-6 text-sm text-content-secondary">Loading your account…</p>;

  const subscription = account.subscriptions[0];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-line-subtle pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">Account</p>
          <h1 className="font-display text-2xl font-extrabold text-content-primary">Settings</h1>
        </div>
        <SignOutButton>
          <button type="button" className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700">
            Sign out
          </button>
        </SignOutButton>
      </div>
      <section className="rounded-2xl border border-line-subtle bg-surface p-6">
        <h2 className="font-display text-lg font-bold text-content-primary">Verified profile</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-content-secondary">Name</dt><dd className="font-semibold">{account.user.profile?.fullName || "Not provided"}</dd></div>
          <div><dt className="text-content-secondary">Email</dt><dd className="font-semibold">{account.user.email}</dd></div>
          <div><dt className="text-content-secondary">Phone</dt><dd className="font-semibold">{account.user.phone}</dd></div>
          <div><dt className="text-content-secondary">Application role</dt><dd className="font-semibold">Customer</dd></div>
        </dl>
      </section>
      <section className="rounded-2xl border border-line-subtle bg-surface p-6">
        <h2 className="font-display text-lg font-bold text-content-primary">Subscription</h2>
        {subscription ? (
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-content-secondary">Plan</dt><dd className="font-semibold">{subscription.subscription.planId}</dd></div>
            <div><dt className="text-content-secondary">Status</dt><dd className="font-semibold">{subscription.subscription.status}</dd></div>
            <div><dt className="text-content-secondary">Reference</dt><dd className="font-mono text-xs">{subscription.subscription.leadReferenceCode}</dd></div>
            <div><dt className="text-content-secondary">Delivery area</dt><dd className="font-semibold">{subscription.address?.area || "Not provided"}</dd></div>
          </dl>
        ) : (
          <p className="mt-3 text-sm text-content-secondary">No subscription is linked to this account yet.</p>
        )}
      </section>
    </div>
  );
}
