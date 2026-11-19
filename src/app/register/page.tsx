import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2, Sparkles, Check, ShieldCheck } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-shell";
import { CustomerSignUpForm } from "@/components/auth/customer-sign-up-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Register for your Humming Drops & MedCity Smiles subscription account.",
};

function FormFallback() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[360px]">
      <Loader2 className="w-6 h-6 animate-spin text-forest-700" aria-hidden="true" />
      <p className="mt-3 text-xs text-stone-500">Loading registration form...</p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="bg-canvas selection:bg-forest-100 selection:text-forest-900">
      {/* Main Body */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Why Join Humming Drops */}
          <div className="order-2 lg:order-1 lg:col-span-6 space-y-6 lg:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-forest-50 text-forest-800 border border-forest-200">
              <Sparkles className="w-3.5 h-3.5 text-forest-600" aria-hidden="true" />
              <span>Bangalore&apos;s Morning Nutrition Club</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-950 tracking-tight leading-[1.15]">
              Nourishing the Body. Uplifting the Mind.
            </h2>

            <p className="text-base text-stone-600 leading-relaxed max-w-lg">
              Start your mornings with fresh, hygienic fruit &amp; vegetable boxes. Every subscription includes full membership to the MedCity Smiles community with doctor vitals monitoring.
            </p>

            {/* Plan Highlights */}
            <div className="space-y-3 max-w-lg pt-2">
              <div className="p-4 rounded-2xl bg-white border border-[#E2ECE4] shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-forest-950">Standard Box Plan</span>
                  <span className="font-display font-bold text-sm text-forest-800">₹3,500 <span className="text-xs font-normal text-stone-500">/ mo</span></span>
                </div>
                <p className="mt-1 text-xs text-stone-600">
                  4 Fruits + 2 Veggies + Mix Salad + Sprouts + Dry Fruits 3x/wk + MedCity Smiles membership.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-forest-200/80 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-forest-950">Premium Box Plan</span>
                  <span className="font-display font-bold text-sm text-forest-800">₹4,000 <span className="text-xs font-normal text-stone-500">/ mo</span></span>
                </div>
                <p className="mt-1 text-xs text-stone-600">
                  Daily dry fruits + curated healthy juice drops with CARE by Berrybeats + MedCity lab discounts.
                </p>
              </div>
            </div>

            {/* Trust Points */}
            <ul className="space-y-2 max-w-lg pt-2 text-xs text-stone-600 font-medium">
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </span>
                <span>Free monthly checkup: 1. Blood Sugar, 2. Cholesterol, 3. Blood Pressure</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-2.5 h-2.5" />
                </span>
                <span>Pause or manage deliveries at any time from your customer dashboard</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Custom Registration Form */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex justify-center">
            <AuthCard>
              <Suspense fallback={<FormFallback />}>
                <CustomerSignUpForm />
              </Suspense>
            </AuthCard>
          </div>
        </div>
      </div>
    </div>
  );
}
