"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Save,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardDeliveryPage() {
  const [subscriberName, setSubscriberName] = useState("Subscriber");
  const [refCode, setRefCode] = useState("HD-REG-2026-94182");
  const [isPausedTomorrow, setIsPausedTomorrow] = useState(false);
  const [vacationStart, setVacationStart] = useState("");
  const [vacationEnd, setVacationEnd] = useState("");
  const [vacationSaved, setVacationSaved] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState(
    "Leave at tower reception / Ring doorbell if before 7:30 AM"
  );
  const [notesSaved, setNotesSaved] = useState(false);
  const [pauseToast, setPauseToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hd_subscriber_session");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.customerName) setSubscriberName(data.customerName);
        if (data.referenceCode) setRefCode(data.referenceCode);
        if (typeof data.isPausedTomorrow === "boolean") {
          setIsPausedTomorrow(data.isPausedTomorrow);
        }
        if (data.vacationStart) setVacationStart(data.vacationStart);
        if (data.vacationEnd) setVacationEnd(data.vacationEnd);
        if (data.deliveryNotes) setDeliveryNotes(data.deliveryNotes);
      }
    } catch {}
  }, []);

  const handleToggleTomorrowPause = () => {
    const newState = !isPausedTomorrow;
    setIsPausedTomorrow(newState);
    const msg = newState
      ? "Tomorrow's delivery paused successfully. Your subscription cycle will adjust automatically."
      : "Tomorrow's delivery resumed! Fresh breakfast box will be dispatched from Berrybeats Cafe.";
    setPauseToast(msg);
    setTimeout(() => setPauseToast(null), 4500);

    try {
      const raw = localStorage.getItem("hd_subscriber_session");
      const current = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        "hd_subscriber_session",
        JSON.stringify({ ...current, isPausedTomorrow: newState })
      );
    } catch {}
  };

  const handleSaveVacation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacationStart || !vacationEnd) return;
    setVacationSaved(true);
    setTimeout(() => setVacationSaved(false), 3500);

    try {
      const raw = localStorage.getItem("hd_subscriber_session");
      const current = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        "hd_subscriber_session",
        JSON.stringify({
          ...current,
          vacationStart,
          vacationEnd,
        })
      );
    } catch {}
  };

  const handleClearVacation = () => {
    setVacationStart("");
    setVacationEnd("");
    setVacationSaved(false);

    try {
      const raw = localStorage.getItem("hd_subscriber_session");
      const current = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        "hd_subscriber_session",
        JSON.stringify({
          ...current,
          vacationStart: "",
          vacationEnd: "",
        })
      );
    } catch {}
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 3000);

    try {
      const raw = localStorage.getItem("hd_subscriber_session");
      const current = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        "hd_subscriber_session",
        JSON.stringify({
          ...current,
          deliveryNotes,
        })
      );
    } catch {}
  };

  // Helper date formatted
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line-subtle">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200">
              Delivery Operations
            </span>
            <span className="text-xs text-content-muted font-mono">{refCode}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary">
            Delivery Calendar &amp; Vacation Pause
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary font-sans">
            Manage your daily morning breakfast drop at your Bangalore residence.
          </p>
        </div>

        <Link
          href="/dashboard/overview"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline self-start sm:self-auto"
        >
          <span>← Back to Today&apos;s Box</span>
        </Link>
      </div>

      {/* Toast Alert */}
      {pauseToast && (
        <div className="p-4 rounded-2xl bg-forest-900 text-white shadow-lg text-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{pauseToast}</span>
          </div>
          <button
            onClick={() => setPauseToast(null)}
            className="text-stone-300 hover:text-white font-semibold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1-CLICK TOMORROW PAUSE HERO CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-forest-50/70 via-surface to-forest-50/40 border border-forest-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-forest-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                Next Scheduled Delivery
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-content-primary">
              {tomorrowFormatted}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-content-secondary">
              <span className="inline-flex items-center gap-1 text-forest-900 font-medium">
                <Clock className="w-3.5 h-3.5" /> 7:00 AM – 7:30 AM
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Berrybeats Cafe Hub, Bangalore
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <span className="text-xs text-content-muted">Current status:</span>
            {isPausedTomorrow ? (
              <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-xs px-3 py-1 font-semibold">
                ⏸ Delivery Paused
              </Badge>
            ) : (
              <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-xs px-3 py-1 font-semibold">
                ✓ Active · Scheduled for Morning
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-forest-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-content-primary">
              {isPausedTomorrow
                ? "Box is currently paused for tomorrow morning."
                : "Need to skip tomorrow? 1-click pause will halt kitchen packing."}
            </p>
            <p className="text-[11px] text-content-muted">
              Cutoff policy: Friendly 8:00 PM cutoff the evening prior. No days are lost; paused deliveries credit forward.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleToggleTomorrowPause}
            brand="humming"
            variant={isPausedTomorrow ? "primary" : "secondary"}
            size="md"
            className="rounded-full px-5 whitespace-nowrap self-start sm:self-auto"
          >
            {isPausedTomorrow ? (
              <>
                <PlayCircle className="w-4 h-4 mr-1.5 text-white" />
                <span>Resume Tomorrow&apos;s Drop</span>
              </>
            ) : (
              <>
                <PauseCircle className="w-4 h-4 mr-1.5 text-forest-700" />
                <span>Pause Tomorrow&apos;s Delivery</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* MULTI-DAY VACATION PAUSE & DELIVERY NOTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vacation Date Range */}
        <div className="p-6 rounded-3xl bg-surface border border-line-subtle shadow-card space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-forest-700" />
              <h2 className="font-display font-bold text-base text-content-primary">
                Vacation &amp; Travel Pause
              </h2>
            </div>
            <p className="text-xs text-content-secondary">
              Traveling out of Bangalore? Schedule a multi-day hold. Deliveries resume automatically on your return date.
            </p>
          </div>

          <form onSubmit={handleSaveVacation} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
                  From Date
                </label>
                <input
                  type="date"
                  value={vacationStart}
                  onChange={(e) => setVacationStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-line-subtle text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
                  To Date
                </label>
                <input
                  type="date"
                  value={vacationEnd}
                  onChange={(e) => setVacationEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-line-subtle text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            </div>

            {vacationSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Vacation dates registered! Kitchen holds scheduled.</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="submit"
                disabled={!vacationStart || !vacationEnd}
                brand="humming"
                variant="primary"
                size="sm"
                className="rounded-full px-4 text-xs"
              >
                <Save className="w-3.5 h-3.5 mr-1" />
                <span>Save Vacation Range</span>
              </Button>

              {(vacationStart || vacationEnd) && (
                <button
                  type="button"
                  onClick={handleClearVacation}
                  className="text-xs text-stone-500 hover:text-stone-800 px-3 py-1.5"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Gate Instructions & Delivery Notes */}
        <div className="p-6 rounded-3xl bg-surface border border-line-subtle shadow-card space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-forest-700" />
              <h2 className="font-display font-bold text-base text-content-primary">
                Delivery Instructions &amp; Gate Access
              </h2>
            </div>
            <p className="text-xs text-content-secondary">
              Help our morning dispatch rider ensure your box is left safely and quietly before 7:30 AM.
            </p>
          </div>

          <form onSubmit={handleSaveNotes} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
                Rider Instructions
              </label>
              <textarea
                rows={3}
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Leave with building security desk / Do not ring bell before 7:00 AM"
                className="w-full px-3 py-2 rounded-xl border border-line-subtle text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-forest-600 resize-none font-sans"
              />
            </div>

            {notesSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Delivery instructions updated for morning rider!</span>
              </div>
            )}

            <Button
              type="submit"
              brand="humming"
              variant="secondary"
              size="sm"
              className="rounded-full px-4 text-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1 text-forest-700" />
              <span>Update Rider Notes</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Banglore Dispatch Concierge Support */}
      <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-stone-900">
            Emergency Route Adjustments &amp; Address Change
          </p>
          <p className="text-[11px] text-stone-600">
            Dispatches operate daily from Berrybeats Cafe. For urgent route changes or last-minute early delivery needs, contact our Bangalore concierge team.
          </p>
        </div>
        <a
          href="https://wa.me/918618902810?text=Hello%20Humming%20Drops%20Team%2C%20I%20need%20assistance%20with%20my%20delivery%20schedule"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition shrink-0 self-start sm:self-auto"
        >
          <span>WhatsApp 8618902810</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
