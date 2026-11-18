"use client";

import { useEffect, useState } from "react";
import type { SubscriptionStatus } from "@/types/subscription";

/**
 * Account view-state derived from the real subscription status.
 * Only "active" may show delivery / member-benefit UI (CLAUDE.md §6.3).
 */
export type AccountState = "none" | "pending" | "active" | "paused" | "ended";

export interface SubscriberAccount {
  name: string;
  email: string;
  planId: string | null;
  status: SubscriptionStatus | null;
  state: AccountState;
  refCode: string | null;
  subscriptionId: string | null;
  addressId: string | null;
  deliveryNotes: string;
  pauseStart: string;
  pauseEnd: string;
}

export function deriveAccountState(status: SubscriptionStatus | null | undefined): AccountState {
  switch (status) {
    case "confirmed_active":
      return "active";
    case "registration_submitted":
    case "pending_confirmation":
      return "pending";
    case "paused":
      return "paused";
    case "cancelled":
    case "expired":
      return "ended";
    default:
      return "none";
  }
}

export function useSubscriberAccount() {
  const [account, setAccount] = useState<SubscriberAccount | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/customer/me", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Unable to load account.");
        const record = data.subscriptions?.[0];
        const sub = record?.subscription;
        const status = (sub?.status ?? null) as SubscriptionStatus | null;
        if (cancelled) return;
        setAccount({
          name: data.user.profile?.fullName || data.user.email,
          email: data.user.email,
          planId: sub?.planId ?? null,
          status,
          state: deriveAccountState(status),
          refCode: sub?.leadReferenceCode ?? null,
          subscriptionId: sub?.id ?? null,
          addressId: record?.address?.id ?? null,
          deliveryNotes: record?.address?.deliveryNotes ?? "",
          pauseStart: sub?.pauseStart ?? "",
          pauseEnd: sub?.pauseEnd ?? "",
        });
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { account, error };
}
