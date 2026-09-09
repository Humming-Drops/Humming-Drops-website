import type { Metadata } from "next";
import Link from "next/link";
import { OFFICIAL_PLANS } from "@/types/plans";

export const metadata: Metadata = {
  title: "Subscribe | Morning Breakfast Box",
  description: "Start your Humming Drops fresh breakfast box subscription in Bangalore.",
};

export default function SubscribePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <span className="text-xs uppercase tracking-wider font-semibold text-forest-700 bg-forest-50 px-3 py-1 rounded-full">
          Onboarding & Subscription
        </span>
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">
          Join the Humming Drops Journey
        </h1>
        <p className="text-sm text-stone-600">
          Fresh morning nutrition delivered to your doorstep in Bangalore.
        </p>
      </div>

      {/* 5-Step Progress Tracker Shell */}
      <nav aria-label="Subscription Steps" className="py-4 border-y border-stone-200">
        <ol className="flex justify-between items-center text-xs font-semibold text-stone-500">
          <li className="flex items-center text-forest-900 font-bold">
            <span className="w-6 h-6 rounded-full bg-forest-900 text-white flex items-center justify-center mr-1.5 text-xs">1</span>
            Plan
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center mr-1.5 text-xs">2</span>
            Account
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center mr-1.5 text-xs">3</span>
            Address
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center mr-1.5 text-xs">4</span>
            Diet
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center mr-1.5 text-xs">5</span>
            Fulfill
          </li>
        </ol>
      </nav>

      {/* Step 1 Scaffold */}
      <section className="p-6 rounded-2xl border border-stone-200 bg-white space-y-6">
        <h2 className="text-lg font-bold text-stone-900">Step 1: Choose Your Monthly Subscription Plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border-2 border-forest-900 bg-forest-50/20 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-forest-900">{OFFICIAL_PLANS.standard.name}</span>
              <span className="font-extrabold text-forest-900">₹{OFFICIAL_PLANS.standard.monthlyPriceINR}/mo</span>
            </div>
            <p className="text-xs text-stone-600">Daily 5-compartment breakfast box + dry fruits 3 days/week + free monthly health checkup.</p>
          </div>

          <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-stone-900">{OFFICIAL_PLANS.premium.name}</span>
              <span className="font-extrabold text-stone-900">₹{OFFICIAL_PLANS.premium.monthlyPriceINR}/mo</span>
            </div>
            <p className="text-xs text-stone-600">Standard plus daily dry fruits, special juice drops, and MedCity Labs package discounts.</p>
          </div>
        </div>

        {/* Informational Guardrail Callout */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
          <div className="font-semibold text-stone-800">Pluggable Fulfillment Architecture:</div>
          <div>
            This subscription flow supports both <strong>Online Payment Gateway (Razorpay)</strong> and <strong>Assisted Registration (WhatsApp &amp; Phone confirmation)</strong> based on server configuration.
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-stone-100">
          <Link href="/" className="text-xs text-stone-500 hover:underline">← Cancel &amp; Return</Link>
          <button
            type="button"
            disabled
            className="px-6 py-2.5 rounded-full bg-forest-900/50 text-white text-sm font-semibold cursor-not-allowed"
          >
            Continue to Account Details (Phase 6)
          </button>
        </div>
      </section>
    </div>
  );
}
