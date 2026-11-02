"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Activity,
  Users,
  Brain,
  Sparkles,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle,
  Stethoscope,
  Smile,
  Award,
  Clock,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CONFIRMED_VITALS_BENEFITS } from "@/types/health";
import { HOLISTIC_PILLARS } from "@/types/pillars";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";

interface SessionItem {
  id: string;
  title: string;
  host: string;
  role: string;
  date: string;
  time: string;
  category: "Mindset" | "Nutrition" | "Lifestyle";
  description: string;
}

const UPCOMING_SESSIONS: SessionItem[] = [
  {
    id: "session-1",
    title: "Gut-Brain Connection: How Morning Nutrition Shapes Mental Focus",
    host: "Dr. Ananya Rao",
    role: "Clinical Nutritionist & MedCity Advisor",
    date: "Saturday, Nov 14",
    time: "10:30 AM – 11:30 AM IST",
    category: "Nutrition",
    description: "Understand the biochemical link between whole-food breakfast habits and steady afternoon dopamine levels.",
  },
  {
    id: "session-2",
    title: "Cultivating Positive Self-Talk & Overcoming Morning Anxiety",
    host: "Dr. Karthik Sundaram",
    role: "Preventative Wellness Lead",
    date: "Saturday, Nov 21",
    time: "11:00 AM – 12:00 PM IST",
    category: "Mindset",
    description: "Gentle mindfulness techniques and reframing exercises to turn busy mornings into grounding rituals.",
  },
  {
    id: "session-3",
    title: "Interpreting Your Monthly Vitals: Sugar, Cholesterol & Blood Pressure",
    host: "Dr. Priya Varma",
    role: "Senior Consultant, MedCity Health Labs",
    date: "Saturday, Nov 28",
    time: "4:00 PM – 5:00 PM IST",
    category: "Lifestyle",
    description: "A patient-friendly walk-through of your monthly biomarker checkups and simple lifestyle adjustments.",
  },
];

export default function MedCitySmilesPage() {
  const [rsvpedSessionId, setRsvpedSessionId] = useState<string | null>(null);
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<SessionItem | null>(null);

  const handleOpenRsvp = (session: SessionItem) => {
    setActiveSession(session);
    setRsvpModalOpen(true);
  };

  const handleConfirmRsvp = () => {
    if (activeSession) {
      setRsvpedSessionId(activeSession.id);
      setRsvpModalOpen(false);
    }
  };

  return (
    <div className="w-full bg-mist-50/50" data-theme="medcity">
      {/* 1. EDITORIAL HERO SECTION */}
      <section
        id="medcity-hero"
        aria-label="MedCity Smiles Hero"
        className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-teal-100 bg-gradient-to-b from-white via-teal-50/40 to-mist-50/60"
      >
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-100/50 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-teal-200 text-teal-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
              <span>In Clinical Collaboration with MedCity Health Labs</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-teal-950 tracking-tight leading-[1.12]">
              Uplifting the Mind. <br />
              <span className="text-teal-700">Building a Happier Community.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-sans leading-relaxed max-w-2xl">
              Just as Humming Drops nourishes your physical body each morning, <strong>MedCity Smiles</strong> provides a supportive, inspiring mental wellbeing sanctuary. Enjoy monthly preventative health biomarker checkups, expert-led doctor seminars, and mindful community sharing circles — included free with every subscription.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/subscribe"
                className="px-7 py-3.5 rounded-full bg-teal-800 text-white font-semibold text-sm hover:bg-teal-900 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span>Join with Breakfast Box</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <a
                href="#vitals-center"
                className="px-6 py-3.5 rounded-full bg-white border border-teal-300 text-teal-900 font-semibold text-sm hover:bg-teal-50/80 transition"
              >
                Explore Free Health Checkups
              </a>

              <a
                href={OFFICIAL_CONTACT.whatsappUrl("Hello! I would like to learn more about the MedCity Smiles community and free monthly checkups.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 hover:text-teal-950 px-3 py-2 transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>WhatsApp Counselor</span>
              </a>
            </div>

            {/* Credibility Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-teal-200/60 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-teal-950 text-base sm:text-lg block">3 Free Tests</span>
                <span className="text-stone-500">Sugar, Cholesterol &amp; BP Monthly</span>
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-teal-950 text-base sm:text-lg block">100% Free</span>
                <span className="text-stone-500">With Humming Drops Subscription</span>
              </div>
              <div className="space-y-0.5 col-span-2 sm:col-span-1">
                <span className="font-bold text-teal-950 text-base sm:text-lg block">Expert Doctors</span>
                <span className="text-stone-500">Clinical Nutritionist Guidance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FREE HEALTH VITALS MONITORING CENTER (Placed ABOVE Pillars) */}
      <section
        id="vitals-center"
        aria-label="Preventative Health Monitoring"
        className="py-16 lg:py-24 bg-white border-b border-teal-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
              <Stethoscope className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
              <span>Clinical Preventative Healthcare</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-teal-950 tracking-tight">
              Monthly Biomarker Checkups at No Extra Cost
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              True wellness means verifying your internal health metrics. In partnership with <strong>MedCity Health Labs</strong>, every subscriber receives a comprehensive monthly physical health screening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {CONFIRMED_VITALS_BENEFITS.map((v, i) => (
              <div
                key={i}
                className="p-7 rounded-3xl border border-teal-200/80 bg-gradient-to-b from-white to-teal-50/30 space-y-4 shadow-xs hover:shadow-card transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    {i === 0 ? "🩸" : i === 1 ? "🫀" : "🩺"}
                  </div>
                  <Badge variant="outline" className="text-xs bg-white text-teal-800 border-teal-200">
                    {v.frequency} Screening
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-xl text-teal-950">{v.metricName}</h3>
                  <p className="text-xs text-stone-500 font-medium">Partner: {v.partnerLab}</p>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                  {v.purpose}
                </p>

                <div className="pt-2 border-t border-teal-100 flex items-center gap-2 text-xs text-teal-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Report stored securely in subscriber portal</span>
                </div>
              </div>
            ))}
          </div>

          {/* Clinical Partner Attribution Callout */}
          <div className="p-6 sm:p-8 rounded-3xl bg-teal-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-300">
                <Award className="w-4 h-4" aria-hidden="true" />
                <span>NABL Accredited Laboratory Network</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display">MedCity Health Labs Clinical Standards</h3>
              <p className="text-xs sm:text-sm text-teal-200/80 leading-relaxed font-sans">
                Sample collection and diagnostic analysis are handled by certified phlebotomists. Premium subscribers also receive exclusive discounts on advanced health checkup packages.
              </p>
            </div>
            <Link
              href="/subscribe"
              className="px-6 py-3 rounded-full bg-teal-400 text-teal-950 font-bold text-xs hover:bg-teal-300 transition whitespace-nowrap"
            >
              Start Subscription &amp; Book Screening →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. THE 4 HOLISTIC HEALTH PILLARS (Brochure Page 6) */}
      <section
        id="holistic-pillars"
        aria-label="Holistic Health Pillars"
        className="py-16 lg:py-24 bg-gradient-to-b from-mist-50 to-white border-b border-teal-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-teal-200 text-teal-800 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
              <span>Brochure Page 6 Framework</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-teal-950 tracking-tight">
              Our Holistic Plan: Mind and Body Health
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Sustainable wellbeing requires addressing nutrition, mental resilience, and social connectedness together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {HOLISTIC_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="p-8 rounded-3xl bg-white border border-teal-100/90 shadow-xs hover:shadow-card transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                      Pillar 0{pillar.pillarNumber} · {pillar.label}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {pillar.status === "authoritative" ? "Core Benefit" : "Brochure Topic"}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl text-teal-950">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed font-sans">
                    {pillar.shortCopy}
                  </p>
                </div>

                <div className="pt-4 border-t border-teal-50 text-xs text-stone-500 flex items-center justify-between">
                  <span>Source: {pillar.brochureSource}</span>
                  <span className="text-teal-700 font-semibold flex items-center gap-1">
                    Integrated Feature ✦
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. UPCOMING SESSIONS & COMMUNITY WEBINARS */}
      <section
        id="community-sessions"
        aria-label="Upcoming Community Sessions"
        className="py-16 lg:py-24 bg-white border-b border-teal-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                <span>Live Community Gatherings</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-teal-950 tracking-tight">
                Upcoming Expert-Led Webinars &amp; Circles
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Connect live with medical practitioners, clinical dietitians, and mindfulness leaders every month.
              </p>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              Free Access Included with Every Subscription Plan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {UPCOMING_SESSIONS.map((session) => {
              const isRsvped = rsvpedSessionId === session.id;
              return (
                <div
                  key={session.id}
                  className="p-6 rounded-3xl border border-teal-200/80 bg-gradient-to-b from-white to-teal-50/20 space-y-5 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                        {session.category}
                      </span>
                      <span className="text-xs font-medium text-stone-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" aria-hidden="true" />
                        {session.date}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-teal-950 leading-snug">
                      {session.title}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      {session.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-teal-100">
                    <div>
                      <span className="font-semibold text-xs text-teal-950 block">{session.host}</span>
                      <span className="text-[11px] text-stone-500 block">{session.role}</span>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleOpenRsvp(session)}
                      variant={isRsvped ? "outline" : "primary"}
                      className={`w-full rounded-full text-xs font-semibold py-2.5 ${
                        isRsvped
                          ? "border-emerald-500 text-emerald-800 bg-emerald-50/80"
                          : "bg-teal-800 text-white hover:bg-teal-900"
                      }`}
                    >
                      {isRsvped ? "✓ Enrolled in Webinar" : "RSVP for Live Session"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CLOSING INVITATION CTA */}
      <section
        id="community-join"
        aria-label="Join Community"
        className="py-16 sm:py-20 bg-gradient-to-b from-teal-950 to-teal-900 text-white relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-900/80 border border-teal-700 text-teal-200 text-xs font-semibold">
            <Smile className="w-4 h-4 text-teal-300" aria-hidden="true" />
            <span>Nourishing Body &amp; Mind</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Begin Your Morning Wellness Journey Today
          </h2>

          <p className="text-sm sm:text-base text-teal-200/90 leading-relaxed max-w-2xl mx-auto font-sans">
            Choose between the Standard Plan (₹3,500/month) and the Premium Plan (₹4,000/month). Doorstep Bangalore delivery, free MedCity Smiles membership, and monthly health checkups start automatically.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/subscribe"
              className="px-8 py-4 rounded-full bg-teal-400 text-teal-950 font-bold text-sm hover:bg-teal-300 transition shadow-lg hover:shadow-xl"
            >
              Choose Plan &amp; Join MedCity Smiles →
            </Link>

            <Link
              href="/plans"
              className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition border border-white/20"
            >
              Compare Plans
            </Link>
          </div>
        </div>
      </section>

      {/* RSVP MODAL */}
      {rsvpModalOpen && activeSession && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-teal-100">
            <div className="flex items-center justify-between">
              <Badge className="bg-teal-100 text-teal-800 border-teal-200">Session RSVP</Badge>
              <button
                type="button"
                onClick={() => setRsvpModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-teal-950">{activeSession.title}</h3>
              <p className="text-xs text-stone-500">
                {activeSession.date} · {activeSession.time}
              </p>
              <p className="text-xs text-stone-600 leading-relaxed font-sans pt-1">
                Hosted by {activeSession.host} ({activeSession.role}). MedCity Smiles live sessions are held on Zoom with subscriber Q&amp;A.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-teal-900 space-y-1">
              <span className="font-semibold block">Free for Subscribers</span>
              <span className="text-stone-600 text-[11px] block">
                Your confirmation and live Zoom link will appear on your subscriber dashboard.
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={handleConfirmRsvp}
                className="flex-1 rounded-full bg-teal-800 text-white font-semibold py-2.5 hover:bg-teal-900 text-xs"
              >
                Confirm My RSVP
              </Button>
              <Button
                type="button"
                onClick={() => setRsvpModalOpen(false)}
                variant="outline"
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
