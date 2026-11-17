import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, HeartPulse, Leaf, MessageCircle, PhoneCall, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OFFICIAL_PLANS } from "@/types/plans";

export const metadata: Metadata = {
  title: "Subscription Plans & Inclusions",
  description:
    "Compare Humming Drops Standard (₹3,500/mo) and Premium (₹4,000/mo) monthly fresh breakfast subscriptions.",
};

export default function PlansPage() {
  return (
    <div className="bg-canvas border-b border-line-subtle">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="brand" size="md" className="mx-auto gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>Simple, Transparent Subscriptions</span>
          </Badge>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-content-primary tracking-tight leading-tight">
            Transparent Monthly Plans
          </h1>

          <p className="text-base sm:text-lg text-content-secondary leading-relaxed">
            Doorstep delivery every morning in Bangalore (closed Sundays). All plans include a 4-day Fresh Fruit &amp; Vegetable Box plus a 2-day Healthy Oats Meal, free MedCity Smiles membership, and free monthly vitals health checkups.
          </p>
        </div>

        {/* Plans Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
          {/* Standard Plan */}
          <div className="p-6 sm:p-8 lg:p-9 rounded-3xl border border-line-subtle bg-surface shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="brand" size="sm" className="mb-2.5">
                    Essential Daily Habit
                  </Badge>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary">
                    {OFFICIAL_PLANS.standard.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-content-muted mt-1">
                    {OFFICIAL_PLANS.standard.tagline}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-brand-subtle border border-line-subtle flex items-center justify-center text-brand-primary shrink-0">
                  <Leaf className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>

              <div className="pt-2 pb-5 border-b border-line-subtle flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-black text-content-primary tracking-tight">
                  ₹{OFFICIAL_PLANS.standard.monthlyPriceINR.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-content-muted">/ month</span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-content-primary tracking-wider font-display">
                  Box Inclusions
                </h3>
                <ul className="text-sm space-y-3 text-content-secondary">
                  {OFFICIAL_PLANS.standard.boxInclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-brand-subtle flex items-center justify-center text-brand-primary shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                      </span>
                      <span>
                        <strong className="text-content-primary">{inc.title}</strong> — {inc.frequency}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-5 border-t border-line-subtle">
                <h3 className="text-xs uppercase font-bold text-content-muted tracking-wider font-display">
                  Included Health &amp; Community Perks
                </h3>
                <ul className="text-xs sm:text-sm space-y-2.5 text-content-secondary">
                  {OFFICIAL_PLANS.standard.communityAndHealthPerks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <HeartPulse className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-line-subtle">
              <Button variant="secondary" size="lg" asChild className="w-full justify-center">
                <Link href="/subscribe?plan=standard">
                  <span>Select Standard Plan</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="p-6 sm:p-8 lg:p-9 rounded-3xl border-2 border-amber-400 bg-surface shadow-raised relative flex flex-col justify-between space-y-8">
            <span className="absolute -top-3.5 right-6 sm:right-8 text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 rounded-full shadow-sm inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-100" aria-hidden="true" />
              <span>Recommended</span>
            </span>

            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="warning" size="sm" className="mb-2.5">
                    Complete All-Inclusive
                  </Badge>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary">
                    {OFFICIAL_PLANS.premium.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-content-muted mt-1">
                    {OFFICIAL_PLANS.premium.tagline}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>

              <div className="pt-2 pb-5 border-b border-line-subtle flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-black text-content-primary tracking-tight">
                  ₹{OFFICIAL_PLANS.premium.monthlyPriceINR.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-content-muted">/ month</span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-content-primary tracking-wider font-display">
                  Everything in Standard plus
                </h3>
                <ul className="text-sm space-y-3 text-content-secondary">
                  {OFFICIAL_PLANS.premium.boxInclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-brand-subtle flex items-center justify-center text-brand-primary shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                      </span>
                      <span>
                        <strong className="text-content-primary">{inc.title}</strong> — {inc.frequency}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-5 border-t border-line-subtle">
                <h3 className="text-xs uppercase font-bold text-amber-800 tracking-wider font-display">
                  Exclusive Premium Perks
                </h3>
                <ul className="text-xs sm:text-sm space-y-2.5 text-content-secondary">
                  {OFFICIAL_PLANS.premium.premiumPerks?.map((perk, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 font-medium text-content-primary"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-line-subtle">
              <Button variant="primary" size="lg" asChild className="w-full justify-center shadow-md">
                <Link href="/subscribe?plan=premium">
                  <span>Select Premium Plan</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Assisted Order Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line-subtle max-w-3xl mx-auto text-center space-y-3 shadow-card">
          <h3 className="font-display text-lg sm:text-xl font-extrabold text-content-primary">
            Questions before starting? Speak with our Bangalore team
          </h3>
          <p className="text-sm text-content-secondary max-w-xl mx-auto">
            Need help customizing allergy exclusions or prefer assisted onboarding via WhatsApp? Reach our morning care desk directly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 pt-2">
            <Button variant="primary" size="md" asChild className="bg-[#25D366] hover:bg-[#20ba59]">
              <a
                href="https://wa.me/918618902810"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>WhatsApp: 8618902810</span>
              </a>
            </Button>
            <Button variant="secondary" size="md" asChild>
              <a href="tel:8618902810">
                <PhoneCall className="w-4 h-4" aria-hidden="true" />
                <span>Call: 8618902810</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
