"use client";

import React from "react";
import Link from "next/link";
import {
  AlertCircle,
  Apple,
  ArrowRight,
  Carrot,
  Clock,
  MessageCircle,
  Nut,
  Salad,
  Sprout,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";
import { useSubscriberAccount, type SubscriberAccount } from "@/lib/use-subscriber-account";

const PLAN_LABEL: Record<string, string> = { standard: "Standard", premium: "Premium" };

function PlaceholderNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
      {children}
    </p>
  );
}

function NoSubscriptionCard() {
  return (
    <div className="rounded-3xl border border-line-subtle bg-surface p-6 sm:p-8 space-y-4">
      <h2 className="font-display text-xl font-bold text-content-primary">You don&apos;t have a subscription yet</h2>
      <p className="text-sm text-content-secondary max-w-xl">
        Choose a plan to start your daily breakfast box. Your delivery details and member benefits appear here once your
        subscription is confirmed.
      </p>
      <Button asChild brand="humming" variant="primary" size="md" className="rounded-full">
        <Link href="/plans">
          <span>View plans</span>
          <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}

function PendingCard({ account }: { account: SubscriberAccount }) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8 space-y-4" role="status">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-amber-700" aria-hidden="true" />
        <h2 className="font-display text-xl font-bold text-amber-950">Registration received — awaiting confirmation</h2>
      </div>
      <p className="text-sm text-amber-900 max-w-xl">
        Your subscription is <strong>not active yet</strong> and no payment has been charged. Our team will contact you
        to confirm. Daily delivery and member benefits start only after confirmation.
      </p>
      {account.refCode && (
        <p className="text-sm text-amber-900">
          Your reference: <span className="font-mono font-semibold">{account.refCode}</span>
        </p>
      )}
      <Button asChild brand="humming" variant="secondary" size="md" className="rounded-full">
        <a
          href={OFFICIAL_CONTACT.whatsappUrl(
            `Hello Humming Drops, my registration reference is ${account.refCode ?? "(pending)"}. Please confirm my subscription.`
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
          <span>WhatsApp {OFFICIAL_CONTACT.phone}</span>
        </a>
      </Button>
    </div>
  );
}

function InactiveCard({ account }: { account: SubscriberAccount }) {
  const paused = account.state === "paused";
  return (
    <div className="rounded-3xl border border-line-subtle bg-surface p-6 sm:p-8 space-y-4" role="status">
      <h2 className="font-display text-xl font-bold text-content-primary">
        {paused ? "Your subscription is paused" : "Your subscription has ended"}
      </h2>
      <p className="text-sm text-content-secondary max-w-xl">
        {paused
          ? "Deliveries are on hold. Contact us to resume."
          : "To start again, choose a plan or contact us on WhatsApp."}
      </p>
      <Button asChild brand="humming" variant="secondary" size="md" className="rounded-full">
        <a href={OFFICIAL_CONTACT.whatsappUrl()} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
          <span>WhatsApp {OFFICIAL_CONTACT.phone}</span>
        </a>
      </Button>
    </div>
  );
}

function ActiveBoxContents({ planId }: { planId: string | null }) {
  const premium = planId === "premium";
  const items = [
    { icon: Apple, title: "4 varieties of fruits", note: "Every day", tone: "text-rose-700 bg-rose-50" },
    { icon: Carrot, title: "2 varieties of vegetables", note: "Every day", tone: "text-amber-700 bg-amber-50" },
    { icon: Salad, title: "Fresh mix salad", note: "Every day", tone: "text-emerald-700 bg-emerald-50" },
    { icon: Sprout, title: "Fresh sprouts", note: "Every day", tone: "text-teal-700 bg-teal-50" },
    {
      icon: Nut,
      title: "Dry fruits",
      note: premium ? "Every day (Premium)" : "3 days a week (Standard)",
      tone: "text-stone-700 bg-stone-100",
    },
  ];

  return (
    <section className="space-y-4" aria-labelledby="box-contents-heading">
      <div className="space-y-1">
        <h2 id="box-contents-heading" className="font-display font-extrabold text-xl text-content-primary">
          What&apos;s in your breakfast box
        </h2>
        <p className="text-xs text-content-secondary">As listed in the Humming Drops brochure.</p>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ icon: Icon, title, note, tone }) => (
          <li key={title} className="p-5 rounded-2xl border border-line-subtle bg-surface flex items-center gap-3">
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${tone}`}>
              <Icon className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold text-sm text-content-primary">{title}</p>
              <p className="text-xs text-content-secondary">{note}</p>
            </div>
          </li>
        ))}
        <li className="p-5 rounded-2xl border border-teal-200 bg-teal-50/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800">
              <Stethoscope className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Free monthly checkup</span>
            </span>
            <p className="text-xs text-teal-800/90 leading-relaxed">Blood Sugar, Cholesterol and Blood Pressure.</p>
          </div>
          <Link
            href="/dashboard/health"
            className="text-xs font-semibold text-teal-900 hover:text-teal-950 flex items-center gap-1 pt-2"
          >
            <span>View health vitals</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </section>
  );
}

export default function DashboardOverviewPage() {
  const { account, error } = useSubscriberAccount();

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50/70 p-6 flex items-start gap-3 text-sm text-red-800"
      >
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-bold">Unable to load your subscriber account</p>
          <p className="text-xs text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="space-y-8 animate-pulse" role="status" aria-busy="true" aria-label="Loading subscriber account">
        <div className="space-y-3 pb-6 border-b border-line-subtle">
          <div className="h-5 w-44 rounded-full bg-muted" />
          <div className="h-8 w-64 rounded-xl bg-muted" />
        </div>
        <div className="h-48 rounded-2xl bg-muted/60 border border-line-subtle" />
      </div>
    );
  }

  const planLabel = account.planId ? PLAN_LABEL[account.planId] ?? account.planId : null;
  const statusLabel =
    account.state === "active"
      ? "Active subscription"
      : account.state === "pending"
        ? "Pending confirmation"
        : account.state === "paused"
          ? "Paused"
          : account.state === "ended"
            ? "Ended"
            : "No subscription";

  return (
    <div className="space-y-8">
      <div className="space-y-1 pb-6 border-b border-line-subtle">
        <div className="inline-flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200">
            {statusLabel}
          </span>
          {account.refCode && <span className="text-xs text-content-muted font-mono">{account.refCode}</span>}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary">
          Welcome, {account.name}
        </h1>
        {planLabel && account.state !== "none" && (
          <p className="text-xs sm:text-sm text-content-secondary">Plan: {planLabel}</p>
        )}
      </div>

      {account.state === "none" && <NoSubscriptionCard />}
      {account.state === "pending" && <PendingCard account={account} />}
      {(account.state === "paused" || account.state === "ended") && <InactiveCard account={account} />}

      {account.state === "active" && (
        <>
          <section className="rounded-3xl border border-line-subtle bg-surface p-6 space-y-3" aria-labelledby="dispatch-heading">
            <h2 id="dispatch-heading" className="font-display font-bold text-base sm:text-lg text-content-primary">
              Today&apos;s delivery
            </h2>
            <PlaceholderNote>
              PLACEHOLDER — CLIENT CONTENT REQUIRED: delivery window and live dispatch tracking are not yet confirmed.
            </PlaceholderNote>
            <Link
              href="/dashboard/delivery"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline"
            >
              <span>Manage delivery</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </section>
          <ActiveBoxContents planId={account.planId} />
        </>
      )}
    </div>
  );
}
