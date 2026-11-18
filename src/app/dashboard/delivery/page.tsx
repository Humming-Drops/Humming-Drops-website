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
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50/70 p-6 flex items-start gap-3 text-sm text-red-800">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="font-bold">{accountError}</p>
      </div>
    );
  }
  if (!account) {
    return <div className="h-48 rounded-2xl bg-muted/60 animate-pulse" aria-busy="true" aria-label="Loading delivery settings" />;
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
    "w-full px-3 py-2.5 min-h-[42px] rounded-xl border border-line-subtle text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-forest-600 disabled:opacity-60";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line-subtle">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200">
              Delivery
            </span>
            {account.refCode && <span className="text-xs text-content-muted font-mono">{account.refCode}</span>}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary">
            Delivery &amp; vacation pause
          </h1>
        </div>
        <Link href="/dashboard/overview" className="text-xs font-semibold text-brand-primary hover:underline">
          ← Back to overview
        </Link>
      </div>

      {!isActive && (
        <div role="status" className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-sm text-amber-950 space-y-2">
          <p className="font-bold">
            {account.state === "pending"
              ? "Delivery settings unlock once your subscription is confirmed."
              : account.state === "none"
                ? "You don't have a subscription yet."
                : "Delivery settings are unavailable for this subscription."}
          </p>
          <p className="text-xs">
            {account.state === "none" ? (
              <Link href="/plans" className="font-semibold underline">
                View plans
              </Link>
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
        </div>
      )}

      <div aria-live="polite">
        {message && (
          <div
            role={message.kind === "error" ? "alert" : "status"}
            className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
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

      {isActive && (
      <section className="p-6 rounded-3xl border border-forest-200 bg-forest-50/40 space-y-5" aria-labelledby="tomorrow-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-forest-800">Next delivery day</p>
            <h2 id="tomorrow-heading" className="font-display text-xl sm:text-2xl font-bold text-content-primary">
              {tomorrowLabel}
            </h2>
            <p className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 inline-block">
              PLACEHOLDER — CLIENT CONTENT REQUIRED: delivery window and pause cutoff time are not confirmed.
            </p>
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
          className="rounded-full px-5"
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
      </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="p-6 rounded-3xl bg-surface border border-line-subtle space-y-5" aria-labelledby="vacation-heading">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-forest-700" aria-hidden="true" />
            <h2 id="vacation-heading" className="font-display font-bold text-base text-content-primary">
              Vacation pause
            </h2>
          </div>
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
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={!isActive || !vacationStart || !vacationEnd || busy !== null}
                brand="humming"
                variant="primary"
                size="sm"
                className="rounded-full px-4 text-xs"
              >
                <Save className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                <span>{busy === "vacation" ? "Saving…" : "Save vacation range"}</span>
              </Button>
              {isActive && (vacationStart || vacationEnd) && (
                <button type="button" onClick={handleClearVacation} disabled={busy !== null} className="text-xs text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600">
                  Clear
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="p-6 rounded-3xl bg-surface border border-line-subtle space-y-5" aria-labelledby="notes-heading">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-forest-700" aria-hidden="true" />
            <h2 id="notes-heading" className="font-display font-bold text-base text-content-primary">
              Delivery instructions
            </h2>
          </div>
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
              size="sm"
              className="rounded-full px-4 text-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              <span>{busy === "notes" ? "Saving…" : "Save instructions"}</span>
            </Button>
          </form>
        </section>
      </div>

      <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-stone-900">Need an urgent change or a new address?</p>
          <p className="text-[11px] text-stone-600">Contact the Humming Drops team on WhatsApp.</p>
        </div>
        <a
          href={OFFICIAL_CONTACT.whatsappUrl("Hello Humming Drops Team, I need assistance with my delivery schedule")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition shrink-0 self-start sm:self-auto"
        >
          <span>WhatsApp {OFFICIAL_CONTACT.phone}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
