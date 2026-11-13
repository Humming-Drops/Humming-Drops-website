"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Video,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  MessageCircle,
  Brain,
  Smile,
  HeartHandshake,
  ArrowRight,
  Send,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CommunityEvent {
  id: string;
  title: string;
  speaker: string;
  role: string;
  date: string;
  time: string;
  category: "Mind & Mood" | "Nutrition & Science" | "Movement & Yoga" | "Sharing Circle";
  description: string;
}

const UPCOMING_EVENTS: CommunityEvent[] = [
  {
    id: "evt-1",
    title: "Fuel Your Brain: How Daily Nutrition Stabilizes Mood & Focus",
    speaker: "Dr. Arvind Rao & Kavita Sundaram",
    role: "Clinical Psychologist & Lead Nutritionist",
    date: "Saturday, 7 Nov 2026",
    time: "10:30 AM – 11:30 AM IST",
    category: "Nutrition & Science",
    description: "Explore the gut-brain axis, morning glycemic stability, and how whole fruits, raw vegetables, and nuts prevent mid-day cognitive dips.",
  },
  {
    id: "evt-2",
    title: "Cultivate Positive Self-Talk & Morning Mindfulness",
    speaker: "Dr. Arvind Rao",
    role: "Mindfulness & Resilience Coach",
    date: "Wednesday, 11 Nov 2026",
    time: "07:00 PM – 08:00 PM IST",
    category: "Mind & Mood",
    description: "Interactive session on reframing negative self-talk, cultivating joyful rituals, and practicing 5-minute morning box meditation.",
  },
  {
    id: "evt-3",
    title: "MedCity Smiles Live Circle: Celebrating Small Wins",
    speaker: "MedCity Smiles Community Facilitators",
    role: "Peer Support & Doctor Q&A",
    date: "Sunday, 15 Nov 2026",
    time: "11:00 AM – 12:15 PM IST",
    category: "Sharing Circle",
    description: "Safe, uplifting community room where subscribers share healthy habit breakthroughs, breakfast recipes, and ask doctors live questions.",
  },
];

export default function DashboardCommunityPage() {
  const [rsvps, setRsvps] = useState<Record<string, boolean>>({ "evt-1": true });
  const [questionText, setQuestionText] = useState("");
  const [questionSent, setQuestionSent] = useState(false);

  const toggleRsvp = (id: string) => {
    setRsvps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQuestionSent(true);
    setQuestionText("");
    setTimeout(() => setQuestionSent(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line-subtle">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
              MedCity Smiles Community Hub
            </span>
            <span className="text-xs text-content-muted">Mental &amp; Emotional Wellbeing</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-teal-950">
            Live Classes, Doctor Seminars &amp; Community Circles
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans">
            Free membership included with your Humming Drops subscription. Nourish your mind alongside your body.
          </p>
        </div>

        <Link
          href="/medcity-smiles"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 hover:underline self-start sm:self-auto"
        >
          <span>Explore Public Community Hub →</span>
        </Link>
      </div>

      {/* 4 WELLBEING PILLARS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-1.5">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <Brain className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-teal-950">1. Fuel Your Brain</h2>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Nutritional foundation supporting stable mood &amp; cognitive energy.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-1.5">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <Smile className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-teal-950">2. Positive Self-Talk</h2>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Overcoming negative loops &amp; celebrating daily mindful micro-wins.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-1.5">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-teal-950">3. Coping Toolkits</h2>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Movement, yoga, breathwork, and creative emotional outlets.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-1.5">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-teal-950">4. Community Gatherings</h2>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Safe live circles and doctor seminars where members grow together.
          </p>
        </div>
      </div>

      {/* UPCOMING LIVE WEBINARS & CLASSES */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-teal-700" />
            <h2 className="font-display font-bold text-base sm:text-lg text-stone-900">
              Upcoming Live Sessions &amp; Interactive Classes
            </h2>
          </div>
          <Badge className="bg-teal-100 text-teal-900 border-teal-200 text-xs">
            Free With Membership
          </Badge>
        </div>

        <div className="space-y-4">
          {UPCOMING_EVENTS.map((event) => {
            const isRsvpd = !!rsvps[event.id];

            return (
              <div
                key={event.id}
                className="p-6 rounded-3xl bg-surface border border-line-subtle shadow-card hover:border-teal-300 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                        {event.category}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        Hosted by {event.speaker} ({event.role})
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-stone-900">
                      {event.title}
                    </h3>
                  </div>

                  <Button
                    type="button"
                    onClick={() => toggleRsvp(event.id)}
                    brand="medcity"
                    variant={isRsvpd ? "primary" : "secondary"}
                    size="sm"
                    className="rounded-full px-5 text-xs whitespace-nowrap self-start sm:self-auto shrink-0"
                  >
                    {isRsvpd ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-300" />
                        <span>RSVP Confirmed</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5 mr-1 text-teal-700" />
                        <span>RSVP for Live Session</span>
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {event.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-3 border-t border-stone-100">
                  <span className="inline-flex items-center gap-1 font-medium text-stone-900">
                    <Calendar className="w-3.5 h-3.5 text-teal-700" />
                    {event.date}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-700" />
                    {event.time}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-teal-800 font-semibold">
                    <Video className="w-3.5 h-3.5" /> Live Zoom &amp; Q&amp;A
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ASK THE DOCTORS & NUTRITIONISTS COMMUNITY FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-surface border border-line-subtle shadow-card space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-teal-700" />
              <h2 className="font-display font-bold text-base text-stone-900">
                Ask a Doctor or Nutritionist
              </h2>
            </div>
            <p className="text-xs text-stone-600">
              Submit confidential health questions. Answers are reviewed by MedCity Health Labs doctors and discussed during weekly community circles.
            </p>
          </div>

          <form onSubmit={handleSubmitQuestion} className="space-y-3">
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. Can fasting blood sugar be impacted by late dinner? Or what fruits are best for afternoon mental clarity?"
              className="w-full px-3 py-2 rounded-xl border border-line-subtle text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-teal-700 resize-none font-sans"
            />

            {questionSent && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Question received! Our clinical advisory team will review it.</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={!questionText.trim()}
              brand="medcity"
              variant="primary"
              size="sm"
              className="rounded-full px-5 text-xs bg-teal-800 hover:bg-teal-900"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>Submit to Medical Board</span>
            </Button>
          </form>
        </div>

        {/* WhatsApp Smiles Circle */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-50/70 via-surface to-teal-50/30 border border-teal-200 shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-teal-800" />
              <h2 className="font-display font-bold text-base text-stone-900">
                MedCity Smiles WhatsApp Circle
              </h2>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Join our members-only WhatsApp broadcast for daily morning affirmations, produce freshness updates from Berrybeats Cafe, and direct announcements for weekly webinars.
            </p>
          </div>

          <a
            href="https://wa.me/918618902810?text=Hello%20MedCity%20Smiles%20Team%2C%20please%20add%20me%20to%20the%20community%20broadcast"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 transition shadow-sm w-full sm:w-auto"
          >
            <span>Join WhatsApp Community Broadcast</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
