"use client";

import React from "react";
import Link from "next/link";
import {
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
import {
  DashboardCard,
  DashboardCardTitle,
  DashboardError,
  DashboardLoading,
  DashboardPage,
  DashboardPageHeader,
  DashboardStatusPill,
  PlaceholderNote,
} from "@/components/dashboard/dashboard-ui";

const PLAN_LABEL: Record<string, string> = { standard: "Standard", premium: "Premium" };

function NoSubscriptionCard() {
  return (
    <DashboardCard className="space-y-4">
      <DashboardCardTitle>You don&apos;t have a subscription yet</DashboardCardTitle>
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
    </DashboardCard>
  );
}

function PendingCard({ account }: { account: SubscriberAccount }) {
  return (
    <DashboardCard tone="warning" className="space-y-4" role="status">
      <div className="flex items-start gap-2">
        <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
        <h2 className="font-display text-lg font-bold text-amber-950">Registration received — awaiting confirmation</h2>
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
    </DashboardCard>
  );
}

function InactiveCard({ account }: { account: SubscriberAccount }) {
  const paused = account.state === "paused";
  return (
    <DashboardCard className="space-y-4" role="status">
      <DashboardCardTitle>{paused ? "Your subscription is paused" : "Your subscription has ended"}</DashboardCardTitle>
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
    </DashboardCard>
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
        <DashboardCardTitle id="box-contents-heading">What&apos;s in your breakfast box</DashboardCardTitle>
        <p className="text-xs text-content-secondary">As listed in the Humming Drops brochure.</p>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(({ icon: Icon, title, note, tone }) => (
          <DashboardCard as="li" key={title} className="flex items-center gap-3">
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${tone}`}>
              <Icon className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold text-sm text-content-primary">{title}</p>
              <p className="text-xs text-content-secondary">{note}</p>
            </div>
          </DashboardCard>
        ))}
        <DashboardCard as="li" tone="teal" className="flex flex-col justify-between gap-1">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-900">
              <Stethoscope className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Free monthly checkup</span>
            </span>
            <p className="text-xs text-teal-800 leading-relaxed">Blood Sugar, Cholesterol and Blood Pressure.</p>
          </div>
          <Link
            href="/dashboard/health"
            className="inline-flex items-center gap-1 min-h-[44px] self-start text-xs font-semibold text-teal-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded"
          >
            <span>View health vitals</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </DashboardCard>
      </ul>
    </section>
  );
}

export default function DashboardOverviewPage() {
  const { account, error } = useSubscriberAccount();

  if (error) {
    return <DashboardError title="Unable to load your subscriber account" detail={error} />;
  }

  if (!account) {
    return <DashboardLoading label="Loading subscriber account" />;
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
    <DashboardPage>
      <DashboardPageHeader
        meta={
          <>
            <DashboardStatusPill>{statusLabel}</DashboardStatusPill>
            {account.refCode && <span className="text-xs text-content-muted font-mono">{account.refCode}</span>}
          </>
        }
        title={<>Welcome, {account.name}</>}
        description={planLabel && account.state !== "none" ? <>Plan: {planLabel}</> : undefined}
      />

      {account.state === "none" && <NoSubscriptionCard />}
      {account.state === "pending" && <PendingCard account={account} />}
      {(account.state === "paused" || account.state === "ended") && <InactiveCard account={account} />}

      {account.state === "active" && (
        <>
          <DashboardCard className="space-y-3" aria-labelledby="dispatch-heading">
            <DashboardCardTitle id="dispatch-heading">Today&apos;s delivery</DashboardCardTitle>
            <PlaceholderNote>
              PLACEHOLDER — CLIENT CONTENT REQUIRED: delivery window and live dispatch tracking are not yet confirmed.
            </PlaceholderNote>
            <Link
              href="/dashboard/delivery"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-semibold text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
            >
              <span>Manage delivery</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </DashboardCard>
          <ActiveBoxContents planId={account.planId} />
        </>
      )}
    </DashboardPage>
  );
}
