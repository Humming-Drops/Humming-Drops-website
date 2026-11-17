"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";

interface AccountData {
  user: {
    email: string;
    phone: string;
    profile?: { fullName: string; phone: string };
  };
  subscriptions: Array<{
    subscription: { planId: string; leadReferenceCode: string; status: string };
    address?: { area: string; city: string; pincode: string };
  }>;
}

export default function DashboardSettingsPage() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadAccount = () => {
    fetch("/api/customer/me")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load account.");
        setAccount(data);
        setFullName(data.user.profile?.fullName || "");
        setPhone(data.user.phone || "");
      })
      .catch((reason: Error) => setError(reason.message));
  };

  useEffect(() => {
    loadAccount();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setIsSaving(true);
    try {
      const res = await fetch("/api/customer/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "profile", fullName, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to save your profile. Please try again.");
      }
      setIsEditing(false);
      loadAccount();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Unable to save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50/70 p-6 flex items-start gap-3 text-sm text-red-800"
      >
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
        <p>{error}</p>
      </div>
    );
  }
  if (!account) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading profile settings">
        <div className="h-14 w-56 rounded-xl bg-muted/70" />
        <div className="h-44 rounded-2xl bg-muted/70 border border-line-subtle" />
        <div className="h-36 rounded-2xl bg-muted/70 border border-line-subtle" />
      </div>
    );
  }

  const subscription = account.subscriptions[0];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line-subtle pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">Account</p>
          <h1 className="font-display text-2xl font-extrabold text-content-primary">Profile &amp; Settings</h1>
        </div>
        <SignOutButton>
          <button
            type="button"
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 min-h-[38px] text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            Sign out
          </button>
        </SignOutButton>
      </div>

      <section className="rounded-2xl border border-line-subtle bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-content-primary">Your profile</h2>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold text-brand-primary hover:underline px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <div className="space-y-1">
              <label htmlFor="fullName" className="block text-xs font-bold text-content-secondary">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                minLength={2}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-line-subtle focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-xs font-bold text-content-secondary">
                WhatsApp mobile number
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
                  className="w-full px-3 py-2.5 text-sm rounded-r-xl border border-line-subtle focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-content-secondary">Email (managed by sign-in provider)</label>
              <input
                type="email"
                disabled
                value={account.user.email}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-line-subtle bg-muted/40 text-content-secondary"
              />
            </div>

            {saveError ? <p className="text-xs text-red-600">{saveError}</p> : null}

            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving} className="rounded-full">
                Save changes
              </Button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSaveError(null);
                  setFullName(account.user.profile?.fullName || "");
                  setPhone(account.user.phone || "");
                }}
                className="text-xs font-semibold text-content-secondary hover:text-content-primary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-content-secondary">Name</dt><dd className="font-semibold">{account.user.profile?.fullName || "Not provided"}</dd></div>
            <div><dt className="text-content-secondary">Email</dt><dd className="font-semibold">{account.user.email}</dd></div>
            <div><dt className="text-content-secondary">Phone</dt><dd className="font-semibold">{account.user.phone}</dd></div>
            <div><dt className="text-content-secondary">Application role</dt><dd className="font-semibold">Customer</dd></div>
          </dl>
        )}
      </section>

      <section className="rounded-2xl border border-line-subtle bg-surface p-6">
        <h2 className="font-display text-lg font-bold text-content-primary">Subscription</h2>
        {subscription ? (
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-content-secondary">Plan</dt><dd className="font-semibold capitalize">{subscription.subscription.planId}</dd></div>
            <div><dt className="text-content-secondary">Status</dt><dd className="mt-1"><StatusBadge status={subscription.subscription.status} /></dd></div>
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
