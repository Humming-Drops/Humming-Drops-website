import type { Metadata } from "next";
import Link from "next/link";
import { CONFIRMED_VITALS_BENEFITS } from "@/types/health";

export const metadata: Metadata = {
  title: "MedCity Smiles | Mind & Community Wellness",
  description:
    "Supportive, inspiring mental health and community space in partnership with MedCity Health Labs. Expert-led seminars, vital monitoring, and mindful coping practices.",
};

export default function MedCitySmilesPage() {
  return (
    <div className="w-full" data-theme="medcity">

      {/* Main Structural Shell */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-16">
        {/* Hero Shell */}
        <section id="medcity-hero" aria-label="MedCity Smiles Hero" className="py-8 border-b border-teal-200">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
              In Collaboration with MedCity Health Labs
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-900 tracking-tight">
              Uplifting the Mind. Building a Happier Community.
            </h1>
            <p className="text-lg text-stone-600">
              Just as Humming Drops nourishes your body, MedCity Smiles focuses on providing a supportive, inspiring space with expert-led seminars, joyful live sessions, and proactive physical & mental health monitoring.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/subscribe"
                className="px-6 py-3 rounded-full bg-teal-700 text-white font-semibold hover:bg-teal-800 transition"
              >
                Get Started with Breakfast Box
              </Link>
              <Link
                href="#holistic-plan"
                className="px-6 py-3 rounded-full border border-teal-300 text-teal-900 font-semibold hover:bg-teal-50 transition"
              >
                Our Holistic Plan
              </Link>
            </div>
          </div>
        </section>

        {/* Holistic Plan Pillars (Brochure Page 6) */}
        <section id="holistic-plan" aria-label="Holistic Plan" className="py-8 border-b border-teal-200">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-teal-900">Our Holistic Plan: Mind and Body Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-teal-100 space-y-2">
                <h3 className="text-lg font-bold text-teal-900">1. Fuel Your Brain</h3>
                <p className="text-sm text-stone-600">
                  Eating a balanced diet supports brain health and is key to a stable mood. (That&apos;s where your Humming Drops monthly package comes in!).
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-teal-100 space-y-2">
                <h3 className="text-lg font-bold text-teal-900">2. Free Health Monitoring</h3>
                <p className="text-sm text-stone-600">
                  Your membership includes free monthly checkups for Blood Sugar, Cholesterol, and Blood Pressure powered by MedCity Health Labs.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-teal-100 space-y-2">
                <h3 className="text-lg font-bold text-teal-900">3. Cultivate Positive Self-Talk</h3>
                <p className="text-sm text-stone-600">
                  Challenge negative thoughts and replace them with realistic, kind ones. Celebrate small achievements and be compassionate with yourself.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-teal-100 space-y-2">
                <h3 className="text-lg font-bold text-teal-900">4. Happy-Healthy Coping Mechanisms</h3>
                <p className="text-sm text-stone-600">
                  Engage in movement, practice mindfulness, use creative outlets, and participate in joyful live community shares.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Free Health Monitoring Section */}
        <section id="vitals" aria-label="Health Monitoring" className="py-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-teal-900">Exclusive Monthly Health Monitoring</h2>
            <p className="text-stone-600">Included free with every Humming Drops monthly subscription:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CONFIRMED_VITALS_BENEFITS.map((v, i) => (
                <div key={i} className="p-5 rounded-xl border border-teal-200 bg-white space-y-2">
                  <div className="text-xs font-semibold uppercase text-teal-700">{v.frequency} Checkup</div>
                  <h3 className="font-bold text-lg text-teal-900">{v.metricName}</h3>
                  <p className="text-xs text-stone-600">{v.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
