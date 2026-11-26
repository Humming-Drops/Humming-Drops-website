"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  MessageSquare,
  PauseCircle,
  PlayCircle,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";
import { useSubscriberAccount } from "@/lib/use-subscriber-account";
import {
  DashboardCard,
  DashboardCardTitle,
  DashboardError,
  DashboardLoading,
  DashboardPage,
  DashboardPageHeader,
  PlaceholderNote,
} from "@/components/dashboard/dashboard-ui";

/** Local calendar date as YYYY-MM-DD (toISOString would shift the day in IST). */
function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function patchCustomer(body: Record<string, unknown>): Promise<void> {
  const response = await fetch("/api/customer/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
}

export default function DashboardDeliveryPage() {
  const { account, error: accountError } = useSubscriberAccount();

  const [vacationStart, setVacationStart] = useState("");
  const [vacationEnd, setVacationEnd] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [busy, setBusy] = useState<null | "tomorrow" | "vacation" | "notes">(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!account) return;
    setVacationStart(account.pauseStart);
    setVacationEnd(account.pauseEnd);
    setDeliveryNotes(account.deliveryNotes);
  }, [account]);

  if (accountError) {
    return <DashboardError title={accountError} />;
  }
  if (!account) {
    return <DashboardLoading label="Loading delivery settings" />;
  }

  const isActive = account.state === "active";
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = toLocalDateString(tomorrow);
  const tomorrowLabel = tomorrow.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const hasRange = !!vacationStart && !!vacationEnd;
  const isPausedTomorrow = hasRange && vacationStart <= tomorrowKey && tomorrowKey <= vacationEnd;
  // The one-tap button only manages a single-day pause for tomorrow. Any other saved
  // range is edited in the vacation form so it is never overwritten or wiped by accident.
  const isSingleTomorrow = hasRange && vacationStart === tomorrowKey && vacationEnd === tomorrowKey;
  const quickPauseBlocked = hasRange && !isSingleTomorrow;

  async function run(kind: "tomorrow" | "vacation" | "notes", action: () => Promise<void>, okText: string) {
    setBusy(kind);
    setMessage(null);
    try {
      await action();
      setMessage({ kind: "ok", text: okText });
    } catch (e) {
      setMessage({ kind: "error", text: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      setBusy(null);
    }
  }

  const savePause = (start: string, end: string) =>
    patchCustomer({ type: "pause", subscriptionId: account.subscriptionId, pauseStart: start, pauseEnd: end }).then(() => {
      setVacationStart(start);
      setVacationEnd(end);
    });

  const handleToggleTomorrow = () =>
    isPausedTomorrow
      ? run("tomorrow", () => savePause("", ""), "Pause removed.")
      : run("tomorrow", () => savePause(tomorrowKey, tomorrowKey), "Tomorrow's delivery is paused.");

  const handleSaveVacation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacationStart || !vacationEnd) return;
    if (vacationEnd < vacationStart) {
      setMessage({ kind: "error", text: "The end date must be on or after the start date." });
      return;
    }
    void run("vacation", () => savePause(vacationStart, vacationEnd), "Vacation dates saved.");
  };

  const handleClearVacation = () => void run("vacation", () => savePause("", ""), "Vacation dates cleared.");

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    const text = deliveryNotes.trim();
    if (!text) {
      setMessage({ kind: "error", text: "Enter an instruction before saving." });
      return;
    }
    void run(
      "notes",
      () => patchCustomer({ type: "delivery_notes", addressId: account.addressId, deliveryNotes: text }),
      "Delivery instructions saved."
    );
  };

  const inputClass =
    "w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-line-subtle text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-forest-600 disabled:opacity-60";

  return (
    <DashboardPage>
      <DashboardPageHeader
        meta={account.refCode ? <span className="text-xs text-content-muted font-mono">{account.refCode}</span> : undefined}
        title={<>Delivery &amp; vacation pause</>}
      />

      {!isActive && (
        <DashboardCard as="div" tone="warning" role="status" className="text-sm space-y-2">
          <p className="font-bold">
            {account.state === "pending"
              ? "Delivery settings unlock once your subscription is confirmed."
              : account.state === "none"
                ? "You don't have a subscription yet."
                : "Delivery settings are unavailable for this subscription."}
          </p>
          <p className="text-xs">
            {account.state === "none" ? (
              <>
                Once you subscribe and our team confirms it, you can pause deliveries and leave notes for the rider here.{" "}
                <Link href="/plans" className="inline-flex items-center min-h-[44px] font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 rounded">
                  View plans
                </Link>
              </>
            ) : (
              <>
                Questions? WhatsApp{" "}
                <a className="font-semibold underline" href={OFFICIAL_CONTACT.whatsappUrl()} target="_blank" rel="noopener noreferrer">
                  {OFFICIAL_CONTACT.phone}
                </a>
                .
              </>
            )}
          </p>
        </DashboardCard>
      )}

      <div aria-live="polite" className="empty:hidden">
        {message && (
          <div
            role={message.kind === "error" ? "alert" : "status"}
            className={`p-4 rounded-2xl text-sm flex items-center gap-2 ${
              message.kind === "error"
                ? "bg-red-50 border border-red-200 text-red-800"
                : "bg-forest-900 text-white"
            }`}
          >
            {message.kind === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* Forms only make sense for an active subscription; everyone else
          sees the status card above instead of a page of disabled controls. */}
      {isActive ? (
        <>
      {isActive && (
      <DashboardCard tone="brand" className="space-y-5" aria-labelledby="tomorrow-heading">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-bold text-forest-800">Next delivery day</p>
            <h2 id="tomorrow-heading" className="font-display text-lg font-bold text-content-primary">
              {tomorrowLabel}
            </h2>
            <PlaceholderNote>
              PLACEHOLDER — CLIENT CONTENT REQUIRED: delivery window and pause cutoff time are not confirmed.
            </PlaceholderNote>
          </div>
          {isActive && (
            <Badge
              className={
                isPausedTomorrow
                  ? "bg-amber-100 text-amber-900 border-amber-300 text-xs px-3 py-1 font-semibold"
                  : "bg-emerald-100 text-emerald-900 border-emerald-300 text-xs px-3 py-1 font-semibold"
              }
            >
              {isPausedTomorrow ? "Paused for this day" : "Scheduled"}
            </Badge>
          )}
        </div>

        <Button
          type="button"
          onClick={handleToggleTomorrow}
          disabled={!isActive || busy !== null || quickPauseBlocked}
          brand="humming"
          variant={isPausedTomorrow ? "primary" : "secondary"}
          size="md"
          className="w-full sm:w-auto"
        >
          {isPausedTomorrow ? (
            <>
              <PlayCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
              <span>{busy === "tomorrow" ? "Saving…" : "Resume tomorrow's delivery"}</span>
            </>
          ) : (
            <>
              <PauseCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
              <span>{busy === "tomorrow" ? "Saving…" : "Pause tomorrow's delivery"}</span>
            </>
          )}
        </Button>
        {quickPauseBlocked && (
          <p className="text-xs text-content-secondary">
            {isPausedTomorrow
              ? "Tomorrow is covered by your vacation range. Edit or clear it under Vacation pause."
              : "You have a vacation range saved. Edit or clear it under Vacation pause to use this shortcut."}
          </p>
        )}
      </DashboardCard>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DashboardCard className="space-y-5" aria-labelledby="vacation-heading">
          <DashboardCardTitle id="vacation-heading" icon={Calendar}>
            Vacation pause
          </DashboardCardTitle>
          <form onSubmit={handleSaveVacation} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="vacation-start" className="block text-xs font-semibold text-content-secondary">
                  From date
                </label>
                <input id="vacation-start" type="date" disabled={!isActive} value={vacationStart} onChange={(e) => setVacationStart(e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="vacation-end" className="block text-xs font-semibold text-content-secondary">
                  To date
                </label>
                <input id="vacation-end" type="date" disabled={!isActive} value={vacationEnd} onChange={(e) => setVacationEnd(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="submit"
                disabled={!isActive || !vacationStart || !vacationEnd || busy !== null}
                brand="humming"
                variant="primary"
                size="md"
              >
                <Save className="w-4 h-4 mr-1" aria-hidden="true" />
                <span>{busy === "vacation" ? "Saving…" : "Save vacation range"}</span>
              </Button>
              {isActive && (vacationStart || vacationEnd) && (
                <button type="button" onClick={handleClearVacation} disabled={busy !== null} className="min-h-[44px] text-sm font-semibold text-stone-600 hover:text-stone-900 px-4 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600">
                  Clear
                </button>
              )}
            </div>
          </form>
        </DashboardCard>

        <DashboardCard className="space-y-5" aria-labelledby="notes-heading">
          <DashboardCardTitle id="notes-heading" icon={MessageSquare}>
            Delivery instructions
          </DashboardCardTitle>
          <form onSubmit={handleSaveNotes} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="rider-notes" className="block text-xs font-semibold text-content-secondary">
                Instructions for the delivery rider
              </label>
              <textarea
                id="rider-notes"
                rows={3}
                disabled={!isActive || !account.addressId}
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Leave with building security"
                className={`${inputClass} resize-none font-sans py-2`}
              />
            </div>
            <Button
              type="submit"
              disabled={!isActive || !account.addressId || busy !== null}
              brand="humming"
              variant="secondary"
              size="md"
            >
              <Save className="w-4 h-4 mr-1" aria-hidden="true" />
              <span>{busy === "notes" ? "Saving…" : "Save instructions"}</span>
            </Button>
          </form>
        </DashboardCard>
      </div>

        </>
      ) : null}

      <DashboardCard as="div" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-bold text-content-primary">Need an urgent change or a new address?</p>
          <p className="text-xs text-content-secondary">Contact the Humming Drops team on WhatsApp.</p>
        </div>
        <Button asChild brand="humming" variant="secondary" size="md" className="shrink-0 self-start sm:self-auto">
          <a
            href={OFFICIAL_CONTACT.whatsappUrl("Hello Humming Drops Team, I need assistance with my delivery schedule")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>WhatsApp {OFFICIAL_CONTACT.phone}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </Button>
      </DashboardCard>
    </DashboardPage>
  );
}
