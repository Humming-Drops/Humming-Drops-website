import type { Metadata } from "next";
import Link from "next/link";
import { OFFICIAL_PLANS } from "@/types/plans";

export const metadata: Metadata = {
  title: "Humming Drops | Healthy Drops, Healthier you",
  description:
    "Daily morning doorstep delivery of fresh mixed cut fruit boxes, vegetables, salad, sprouts, and dry fruits in Bangalore.",
};

export default function HomePage() {
  return (
    <div className="w-full">

      {/* Route Content Shell */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-16">
        {/* Section 1: Hero Shell */}
        <section id="hero" aria-label="Hero" className="py-8 border-b border-stone-200">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-forest-700 bg-forest-50 px-3 py-1 rounded-full">
              Morning Doorstep Nutrition
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-forest-900 tracking-tight">
              Healthy Drops, Healthier you
            </h1>
            <p className="text-lg text-stone-600">
              A daily morning delivery of fresh mixed cut fruit boxes, crisp vegetables, fresh mix salad, and sprouts — meticulously prepared to fuel your day.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/subscribe?plan=standard"
                className="px-6 py-3 rounded-full bg-forest-900 text-white font-semibold hover:bg-forest-800 transition"
              >
                Choose Your Plan (₹3,500/mo)
              </Link>
              <Link
                href="/plans"
                className="px-6 py-3 rounded-full border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition"
              >
                Compare Plans & Inclusions
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Box Anatomy Shell (5 Daily Pillars) */}
        <section id="box-anatomy" aria-label="Box Anatomy" className="py-8 border-b border-stone-200">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-forest-900">What is Inside Your Daily Box?</h2>
            <p className="text-stone-600">
              Every morning box contains 5 distinct nutritional compartments (Source: Client Official Brochure):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {OFFICIAL_PLANS.standard.boxInclusions.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-forest-200 bg-white shadow-sm space-y-2">
                  <span className="text-xs font-semibold text-forest-700">{item.frequency}</span>
                  <h3 className="font-semibold text-forest-900">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Plans Teaser Shell */}
        <section id="pricing" aria-label="Subscription Plans" className="py-8 border-b border-stone-200">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-forest-900">Subscription Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <div className="p-6 rounded-2xl border border-stone-200 bg-white space-y-4">
                <h3 className="text-xl font-bold text-stone-900">Standard Plan</h3>
                <div className="text-3xl font-extrabold text-forest-900">₹3,500 <span className="text-sm font-normal text-stone-500">/ month</span></div>
                <p className="text-sm text-stone-600">Complete daily fresh breakfast nutrition & holistic health monitoring.</p>
                <Link
                  href="/subscribe?plan=standard"
                  className="block text-center w-full py-2.5 rounded-full border border-forest-900 text-forest-900 font-semibold hover:bg-forest-50 transition"
                >
                  Select Standard
                </Link>
              </div>

              <div className="p-6 rounded-2xl border-2 border-forest-800 bg-forest-50/40 space-y-4 relative">
                <span className="absolute -top-3 right-6 text-xs font-bold uppercase tracking-wider bg-forest-900 text-white px-3 py-0.5 rounded-full">
                  Recommended
                </span>
                <h3 className="text-xl font-bold text-stone-900">Premium Plan</h3>
                <div className="text-3xl font-extrabold text-forest-900">₹4,000 <span className="text-sm font-normal text-stone-500">/ month</span></div>
                <p className="text-sm text-stone-600">Standard benefits plus daily dry fruits, curated juice drops, and MedCity Labs discounts.</p>
                <Link
                  href="/subscribe?plan=premium"
                  className="block text-center w-full py-2.5 rounded-full bg-forest-900 text-white font-semibold hover:bg-forest-800 transition"
                >
                  Select Premium
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: MedCity Smiles Community Bridge */}
        <section id="medcity-bridge" aria-label="MedCity Smiles Connection" className="py-8">
          <div className="p-6 rounded-2xl bg-teal-900 text-white space-y-3">
            <h2 className="text-xl font-bold">Nourishing the Body, Uplifting the Mind</h2>
            <p className="text-teal-100 max-w-2xl text-sm">
              Your Humming Drops subscription includes free membership to the MedCity Smiles community, featuring doctor and nutritionist guidance, free monthly vitals checks, and mindful live sessions.
            </p>
            <Link
              href="/medcity-smiles"
              className="inline-block text-sm font-semibold text-teal-900 bg-white px-5 py-2 rounded-full hover:bg-teal-50 transition"
            >
              Explore MedCity Smiles Community →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
