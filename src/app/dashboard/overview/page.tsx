"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Sparkles,
  MapPin,
  Utensils,
  HeartPulse,
  Users,
  ArrowRight,
  ShieldCheck,
  Apple,
  Carrot,
  Salad,
  Sprout,
  Nut,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardOverviewPage() {
  const [subscriberName, setSubscriberName] = useState<string | null>(null);
  const [planName, setPlanName] = useState<string | null>(null);
  const [refCode, setRefCode] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/customer/me")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load account.");
        const profile = data.user.profile;
        const subscription = data.subscriptions[0]?.subscription;
        setSubscriberName(profile?.fullName || data.user.email);
        setPlanName(subscription?.planId || "Subscription");
        setRefCode(subscription?.leadReferenceCode || "Pending reference");
      })
      .catch((error: Error) => setAccountError(error.message));
  }, []);

  if (accountError) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50/70 p-6 flex items-start gap-3 text-sm text-red-800"
      >
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-bold">Unable to load your subscriber account</p>
          <p className="text-xs text-red-700">{accountError}</p>
        </div>
      </div>
    );
  }
  if (!subscriberName || !planName || !refCode) {
    return (
      <div className="space-y-8 animate-pulse" aria-busy="true" aria-label="Loading subscriber account">
        <div className="space-y-3 pb-6 border-b border-line-subtle">
          <div className="h-5 w-44 rounded-full bg-muted" />
          <div className="h-8 w-64 rounded-xl bg-muted" />
          <div className="h-4 w-72 max-w-full rounded-lg bg-muted" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 rounded-2xl bg-muted/70 border border-line-subtle" />
          <div className="h-32 rounded-2xl bg-muted/70 border border-line-subtle" />
          <div className="h-32 rounded-2xl bg-muted/70 border border-line-subtle" />
        </div>
        <div className="h-48 rounded-2xl bg-muted/60 border border-line-subtle" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line-subtle">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200">
              Active Morning Subscription
            </span>
            <span className="text-xs text-content-muted font-mono">{refCode}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary">
            Good morning, {subscriberName}
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary font-sans">
            Your {planName} is prepared fresh daily at Berrybeats Cafe, Bangalore.
          </p>
        </div>

        <Link
          href="/dashboard/delivery"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-forest-50 border border-forest-200 text-forest-900 text-xs font-semibold hover:bg-forest-100 transition whitespace-nowrap self-start sm:self-auto"
        >
          <Calendar className="w-3.5 h-3.5 text-forest-700" aria-hidden="true" />
          <span>Manage Delivery Dates</span>
        </Link>
      </div>

      {/* TODAY'S DISPATCH STATUS TIMELINE */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-forest-50/60 to-surface border border-forest-200/80 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-forest-700" aria-hidden="true" />
            <h2 className="font-display font-bold text-base sm:text-lg text-content-primary">
              Today&apos;s Morning Dispatch Timeline
            </h2>
          </div>
          <Badge className="bg-forest-100 text-forest-800 border-forest-300 text-xs">
            Doorstep Delivery: 7:00 AM – 7:30 AM
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-white border border-forest-200 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>01. Harvest &amp; Prep</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            </div>
            <p className="font-bold text-sm text-content-primary">Freshly Sourced</p>
            <p className="text-[11px] text-content-muted">Cut &amp; assembled at 5:00 AM at Berrybeats</p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-white border border-forest-200 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>02. Sealed Box</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            </div>
            <p className="font-bold text-sm text-content-primary">Quality Checked</p>
            <p className="text-[11px] text-content-muted">Hygienically sealed at 5:45 AM</p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-forest-900 text-white space-y-1 shadow-xs ring-2 ring-forest-500/30">
            <div className="flex items-center justify-between text-xs font-semibold text-forest-200">
              <span>03. On Route</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            </div>
            <p className="font-bold text-sm text-white">Out for Delivery</p>
            <p className="text-[11px] text-forest-200/80">Courier dispatched in your corridor</p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-white/70 border border-stone-200 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-400">
              <span>04. Doorstep</span>
              <span>7:15 AM ETA</span>
            </div>
            <p className="font-bold text-sm text-stone-500">Scheduled Delivery</p>
            <p className="text-[11px] text-stone-400">Doorstep drop with bell ring</p>
          </div>
        </div>
      </div>

      {/* TODAY'S 5-COMPARTMENT NUTRITION BREAKDOWN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-xl text-content-primary">
              Today&apos;s Breakfast Box Compartments
            </h2>
            <p className="text-xs text-content-secondary font-sans">
              Hand-selected daily mix conforming to canonical brochure guidelines.
            </p>
          </div>
          <span className="text-xs text-content-muted hidden sm:inline">5 Balanced Nutrients</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Compartment 1: Fruits */}
          <div className="p-5 rounded-2xl border border-line-subtle bg-surface space-y-2 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                <Apple className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>4 Fruits Every Day</span>
              </span>
              <span className="text-[11px] text-content-muted">Vital Hydration</span>
            </div>
            <h3 className="font-bold text-sm text-content-primary">Fresh Seasonal Cut Mix</h3>
            <p className="text-xs text-content-secondary leading-relaxed font-sans">
              Sweet Watermelon cubes, Papaya slices, Pomegranate arils, crisp Green Apple.
            </p>
          </div>

          {/* Compartment 2: Vegetables */}
          <div className="p-5 rounded-2xl border border-line-subtle bg-surface space-y-2 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                <Carrot className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>2 Veggies Every Day</span>
              </span>
              <span className="text-[11px] text-content-muted">Prebiotic Fiber</span>
            </div>
            <h3 className="font-bold text-sm text-content-primary">Crunchy Root &amp; Greens</h3>
            <p className="text-xs text-content-secondary leading-relaxed font-sans">
              Tender Carrot batons, English Cucumber medallions.
            </p>
          </div>

          {/* Compartment 3: Salad */}
          <div className="p-5 rounded-2xl border border-line-subtle bg-surface space-y-2 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                <Salad className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Fresh Mix Salad</span>
              </span>
              <span className="text-[11px] text-content-muted">Micro-Nutrients</span>
            </div>
            <h3 className="font-bold text-sm text-content-primary">Crisp Garden Salad</h3>
            <p className="text-xs text-content-secondary leading-relaxed font-sans">
              Garden Greens, Bell Peppers, and Cherry Tomatoes with herb seasoning.
            </p>
          </div>

          {/* Compartment 4: Sprouts */}
          <div className="p-5 rounded-2xl border border-line-subtle bg-surface space-y-2 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                <Sprout className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Fresh Sprouts</span>
              </span>
              <span className="text-[11px] text-content-muted">Living Enzymes</span>
            </div>
            <h3 className="font-bold text-sm text-content-primary">Sprouted Legumes</h3>
            <p className="text-xs text-content-secondary leading-relaxed font-sans">
              Nutrient-dense Moong &amp; Desi Chana sprouts rich in living plant proteins.
            </p>
          </div>

          {/* Compartment 5: Dry Fruits */}
          <div className="p-5 rounded-2xl border border-line-subtle bg-surface space-y-2 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full">
                <Nut className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Dry Fruits (Daily)</span>
              </span>
              <span className="text-[11px] text-brand-primary font-semibold">Premium Perk</span>
            </div>
            <h3 className="font-bold text-sm text-content-primary">Heart-Healthy Fats</h3>
            <p className="text-xs text-content-secondary leading-relaxed font-sans">
              California Almonds, Kashmiri Walnuts, and Golden Kishmish raisins.
            </p>
          </div>

          {/* Quick Perks Card */}
          <div className="p-5 rounded-2xl border border-teal-200 bg-teal-50/40 space-y-2 shadow-xs flex flex-col justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
                <Stethoscope className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Free Clinical Benefit</span>
              </span>
              <h3 className="font-bold text-sm text-teal-950">MedCity Vitals Screening</h3>
              <p className="text-xs text-teal-800/80 leading-relaxed font-sans">
                Your monthly Blood Sugar, Cholesterol &amp; BP checkup is ready to book.
              </p>
            </div>
            <Link
              href="/dashboard/health"
              className="text-xs font-semibold text-teal-900 hover:text-teal-950 flex items-center gap-1 pt-2"
            >
              <span>View Health Vitals</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
