"use client";

import Link from "next/link";
import { ArrowRight, Brain, HeartHandshake, MessageCircle, Smile, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";
import { useSubscriberAccount } from "@/lib/use-subscriber-account";
import {
  DashboardCard,
  DashboardCardTitle,
  DashboardPage,
  DashboardPageHeader,
  PlaceholderNote,
} from "@/components/dashboard/dashboard-ui";

const PILLARS = [
  { icon: Brain, title: "1. Fuel Your Brain", text: "Nutritional foundation supporting stable mood and cognitive energy." },
  { icon: Smile, title: "2. Positive Self-Talk", text: "Overcoming negative loops and celebrating daily mindful micro-wins." },
  { icon: HeartHandshake, title: "3. Coping Toolkits", text: "Movement, yoga, breathwork, and creative emotional outlets." },
  { icon: Users, title: "4. Community Gatherings", text: "Safe live circles and doctor seminars where members grow together." },
];

export default function DashboardCommunityPage() {
  const { account } = useSubscriberAccount();
  const isMember = account?.state === "active";

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="MedCity Smiles community"
        description={
          <>
            MedCity Smiles membership is included with every plan.{" "}
            <Link href="/medcity-smiles" className="font-semibold text-teal-800 hover:underline">
              Learn more about MedCity Smiles
            </Link>
          </>
        }
      />

      {account && !isMember && (
        <DashboardCard as="div" tone="warning" role="status" className="text-sm">
          Community membership starts once your subscription is confirmed.
        </DashboardCard>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {PILLARS.map(({ icon: Icon, title, text }) => (
          <DashboardCard as="li" key={title} className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
              <Icon className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-content-primary">{title}</h2>
              <p className="text-xs text-content-secondary leading-relaxed">{text}</p>
            </div>
          </DashboardCard>
        ))}
      </ul>

      <DashboardCard className="space-y-3" aria-labelledby="sessions-heading">
        <DashboardCardTitle id="sessions-heading" icon={Video} iconClassName="text-teal-700">
          Live sessions
        </DashboardCardTitle>
        <PlaceholderNote>
          PLACEHOLDER — CLIENT CONTENT REQUIRED: session schedule, hosts and joining details have not been supplied.
        </PlaceholderNote>
        <p className="text-sm text-content-secondary">
          Ask the team on WhatsApp about upcoming community sessions.
        </p>
      </DashboardCard>

      <DashboardCard tone="teal" className="space-y-4" aria-labelledby="circle-heading">
        <DashboardCardTitle id="circle-heading" icon={MessageCircle} iconClassName="text-teal-700">
          Questions and community updates
        </DashboardCardTitle>
        <p className="text-sm text-content-secondary leading-relaxed">
          Reach the Humming Drops team on WhatsApp for community questions or to be added to member updates.
        </p>
        <Button asChild brand="medcity" variant="primary" size="md">
          <a
            href={OFFICIAL_CONTACT.whatsappUrl("Hello MedCity Smiles Team, I have a question about the community.")}
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
