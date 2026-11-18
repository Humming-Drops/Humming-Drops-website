"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Brain, HeartHandshake, MessageCircle, Smile, Users, Video } from "lucide-react";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";
import { useSubscriberAccount } from "@/lib/use-subscriber-account";

const PILLARS = [
  { icon: Brain, title: "1. Fuel Your Brain", text: "Nutritional foundation supporting stable mood and cognitive energy." },
  { icon: Smile, title: "2. Positive Self-Talk", text: "Overcoming negative loops and celebrating daily mindful micro-wins." },
  { icon: HeartHandshake, title: "3. Coping Toolkits", text: "Movement, yoga, breathwork, and creative emotional outlets." },
  { icon: Users, title: "4. Community Gatherings", text: "Safe live circles and doctor seminars where members grow together." },
];

function PlaceholderNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
      {children}
    </p>
  );
}

export default function DashboardCommunityPage() {
  const { account } = useSubscriberAccount();
  const isMember = account?.state === "active";

  return (
    <div className="space-y-8">
      <div className="space-y-1 pb-6 border-b border-line-subtle">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
          MedCity Smiles Community
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-teal-950 pt-1">Community</h1>
        <p className="text-xs sm:text-sm text-stone-600">
          MedCity Smiles membership is included with every plan.{" "}
          <Link href="/medcity-smiles" className="font-semibold text-teal-800 hover:underline">
            Learn more about MedCity Smiles
          </Link>
        </p>
      </div>

      {account && !isMember && (
        <div role="status" className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-sm text-amber-950">
          Community membership starts once your subscription is confirmed.
        </div>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PILLARS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Icon className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 className="text-xs font-bold text-teal-950">{title}</h2>
            <p className="text-[11px] text-stone-600 leading-relaxed">{text}</p>
          </li>
        ))}
      </ul>

      <section className="rounded-3xl border border-line-subtle bg-surface p-6 space-y-3" aria-labelledby="sessions-heading">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-teal-700" aria-hidden="true" />
          <h2 id="sessions-heading" className="font-display font-bold text-base sm:text-lg text-stone-900">
            Live sessions
          </h2>
        </div>
        <PlaceholderNote>
          PLACEHOLDER — CLIENT CONTENT REQUIRED: session schedule, hosts and joining details have not been supplied.
        </PlaceholderNote>
        <p className="text-xs text-stone-600">
          Ask the team on WhatsApp about upcoming community sessions.
        </p>
      </section>

      <section className="rounded-3xl border border-teal-200 bg-teal-50/40 p-6 space-y-4" aria-labelledby="circle-heading">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-teal-800" aria-hidden="true" />
          <h2 id="circle-heading" className="font-display font-bold text-base text-stone-900">
            Questions and community updates
          </h2>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          Reach the Humming Drops team on WhatsApp for community questions or to be added to member updates.
        </p>
        <a
          href={OFFICIAL_CONTACT.whatsappUrl("Hello MedCity Smiles Team, I have a question about the community.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
        >
          <span>WhatsApp {OFFICIAL_CONTACT.phone}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}
