"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { isValidIndianPhone, normalizePhone } from "@/lib/sanitization";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  DashboardCard,
  DashboardCardTitle,
  DashboardError,
  DashboardLoading,
  DashboardPage,
  DashboardPageHeader,
} from "@/components/dashboard/dashboard-ui";

const inputClass =
  "w-full px-3 py-2.5 min-h-[44px] text-sm rounded-xl border border-line-subtle bg-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary";

interface AccountData {
  user: {
    email: string;
    phone: string;
    role?: string;
    profile?: { fullName: string; phone: string };
  };
  subscriptions: Array<{
    subscription: { planId: string; leadReferenceCode: string; status: string };
    address?: { area: string; city: string; pincode: string };
  }>;
}

export default function DashboardSettingsPage() {
  const { logout } = useAuth();
  const [account, setAccount] = useState<AccountData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveErrorField, setSaveErrorField] = useState<"fullName" | "phone" | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadAccount = () => {
    fetch("/api/customer/me")
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
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
    setSaveErrorField(null);
    setSavedNotice(false);

    // Same rules as the server, checked here first to save a round trip.
    if (fullName.trim().length < 2) {
      setSaveError("Full name must be at least 2 characters.");
      setSaveErrorField("fullName");
      requestAnimationFrame(() => document.getElementById("fullName")?.focus());
      return;
    }
    if (!isValidIndianPhone(normalizePhone(phone))) {
      setSaveError("Enter a valid 10-digit Indian mobile number.");
      setSaveErrorField("phone");
      requestAnimationFrame(() => document.getElementById("phone")?.focus());
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/customer/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "profile", fullName, phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        if (data.field === "phone") {
          setSaveErrorField("phone");
          requestAnimationFrame(() => document.getElementById("phone")?.focus());
        }
        throw new Error(data.error || "Unable to save your profile. Please try again.");
      }
      setIsEditing(false);
      setSavedNotice(true);
      loadAccount();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Unable to save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return <DashboardError title={error} />;
  }
  if (!account) {
    return <DashboardLoading label="Loading profile settings" />;
  }

  const subscription = account.subscriptions[0];
  return (
    <DashboardPage>
      <DashboardPageHeader
        title={<>Profile &amp; Settings</>}
      />

      {savedNotice ? (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Your profile was saved.
        </p>
      ) : null}

      <DashboardCard>
        <div className="flex items-center justify-between gap-3">
          <DashboardCardTitle>Your profile</DashboardCardTitle>
          {!isEditing && (
            <button
              type="button"
              onClick={() => { setIsEditing(true); setSavedNotice(false); }}
              className="min-h-[44px] -my-2 -mr-3 px-3 text-sm font-semibold text-brand-primary hover:underline rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <div className="space-y-1">
              <label htmlFor="fullName" className="block text-xs font-semibold text-content-secondary">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                minLength={2}
                aria-invalid={saveError && saveErrorField !== "phone" ? true : undefined}
                aria-describedby={saveError && saveErrorField !== "phone" ? "profile-error" : undefined}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-xs font-semibold text-content-secondary">
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
                  inputMode="numeric"
                  autoComplete="tel-national"
                  aria-invalid={saveError && saveErrorField !== "fullName" ? true : undefined}
                  aria-describedby={saveError && saveErrorField !== "fullName" ? "profile-error" : undefined}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cn(inputClass, "rounded-l-none")}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="accountEmail" className="block text-xs font-semibold text-content-secondary">Email (cannot be changed here)</label>
              <input
                id="accountEmail"
                type="email"
                disabled
                value={account.user.email}
                className={cn(inputClass, "bg-muted/40 text-content-secondary")}
              />
            </div>

            {saveError ? (
              <p id="profile-error" role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
                {saveError}
              </p>
            ) : null}

            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
                Save changes
              </Button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSaveError(null);
                  setSaveErrorField(null);
                  setFullName(account.user.profile?.fullName || "");
                  setPhone(account.user.phone || "");
                }}
                className="min-h-[44px] px-4 rounded-full text-sm font-semibold text-content-secondary hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-content-secondary">Name</dt><dd className="font-semibold">{account.user.profile?.fullName || "Not provided"}</dd></div>
            <div><dt className="text-content-secondary">Email</dt><dd className="font-semibold break-all">{account.user.email}</dd></div>
            <div><dt className="text-content-secondary">Phone</dt><dd className="font-semibold">{account.user.phone || "Not provided"}</dd></div>
            <div><dt className="text-content-secondary">Account type</dt><dd className="font-semibold">{account.user.role === "customer" ? "Customer" : "Staff"}</dd></div>
          </dl>
        )}
      </DashboardCard>

      <DashboardCard>
        <DashboardCardTitle>Subscription</DashboardCardTitle>
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
      </DashboardCard>

      <DashboardCard>
        <DashboardCardTitle>Sign out</DashboardCardTitle>
        <p className="mt-2 text-sm text-content-secondary">Sign out of your Humming Drops account on this device.</p>
        <button
          type="button"
          onClick={() => logout()}
          className="mt-4 rounded-full border border-line-subtle bg-white px-5 min-h-[44px] text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
        >
          Sign out
        </button>
      </DashboardCard>
    </DashboardPage>
  );
}
