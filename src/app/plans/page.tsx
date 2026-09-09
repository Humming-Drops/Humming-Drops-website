import type { Metadata } from "next";
import Link from "next/link";
import { OFFICIAL_PLANS } from "@/types/plans";

export const metadata: Metadata = {
  title: "Subscription Plans & Inclusions",
  description:
    "Compare Humming Drops Standard (₹3,500/mo) and Premium (₹4,000/mo) monthly fresh breakfast subscriptions.",
};

export default function PlansPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
          Transparent Monthly Plans
        </h1>
        <p className="text-stone-600">
          Doorstep delivery every morning in Bangalore. All plans include 5 daily box compartments, free MedCity Smiles membership, and free monthly vitals health checkups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Standard Plan */}
        <div className="p-8 rounded-2xl border border-stone-200 bg-white space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">{OFFICIAL_PLANS.standard.name}</h2>
              <p className="text-xs text-stone-500 mt-1">{OFFICIAL_PLANS.standard.tagline}</p>
            </div>
            <div className="text-4xl font-extrabold text-forest-900">
              ₹{OFFICIAL_PLANS.standard.monthlyPriceINR.toLocaleString()}
              <span className="text-sm font-normal text-stone-500"> / month (~₹{OFFICIAL_PLANS.standard.perDayPriceINR}/day)</span>
            </div>

            <div className="space-y-2 pt-4 border-t border-stone-100">
              <h3 className="text-xs uppercase font-semibold text-stone-400 tracking-wider">Box Inclusions</h3>
              <ul className="text-sm space-y-2 text-stone-700">
                {OFFICIAL_PLANS.standard.boxInclusions.map((inc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-forest-700 font-bold">✓</span>
                    <span><strong>{inc.title}</strong> — {inc.frequency}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-4 border-t border-stone-100">
              <h3 className="text-xs uppercase font-semibold text-stone-400 tracking-wider">Included Health & Community Perks</h3>
              <ul className="text-xs space-y-1.5 text-stone-600">
                {OFFICIAL_PLANS.standard.communityAndHealthPerks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-teal-700 font-bold">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/subscribe?plan=standard"
            className="block text-center w-full py-3 rounded-full border-2 border-forest-900 text-forest-900 font-bold hover:bg-forest-50 transition"
          >
            Select Standard Plan
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="p-8 rounded-2xl border-2 border-forest-900 bg-forest-50/30 space-y-6 flex flex-col justify-between relative shadow-sm">
          <span className="absolute -top-3 right-8 text-xs font-bold uppercase tracking-wider bg-forest-900 text-white px-3 py-0.5 rounded-full">
            Recommended
          </span>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">{OFFICIAL_PLANS.premium.name}</h2>
              <p className="text-xs text-stone-500 mt-1">{OFFICIAL_PLANS.premium.tagline}</p>
            </div>
            <div className="text-4xl font-extrabold text-forest-900">
              ₹{OFFICIAL_PLANS.premium.monthlyPriceINR.toLocaleString()}
              <span className="text-sm font-normal text-stone-500"> / month (~₹{OFFICIAL_PLANS.premium.perDayPriceINR}/day)</span>
            </div>

            <div className="space-y-2 pt-4 border-t border-forest-100">
              <h3 className="text-xs uppercase font-semibold text-forest-800 tracking-wider">Everything in Standard plus</h3>
              <ul className="text-sm space-y-2 text-stone-800">
                {OFFICIAL_PLANS.premium.boxInclusions.map((inc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-forest-700 font-bold">✓</span>
                    <span><strong>{inc.title}</strong> — {inc.frequency}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-4 border-t border-forest-100">
              <h3 className="text-xs uppercase font-semibold text-forest-800 tracking-wider">Exclusive Premium Perks</h3>
              <ul className="text-xs space-y-1.5 text-stone-700">
                {OFFICIAL_PLANS.premium.premiumPerks?.map((perk, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-amber-600 font-bold">★</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/subscribe?plan=premium"
            className="block text-center w-full py-3 rounded-full bg-forest-900 text-white font-bold hover:bg-forest-800 transition"
          >
            Select Premium Plan
          </Link>
        </div>
      </div>
    </div>
  );
}
