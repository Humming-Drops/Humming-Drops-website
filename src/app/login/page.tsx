import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2, Sparkles, HeartPulse, Truck } from "lucide-react";
import { CustomerSignInForm } from "@/components/auth/customer-sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Humming Drops subscriber account to manage morning deliveries and health vitals.",
};

function FormFallback() {
  return (
    <div className="w-full max-w-md mx-auto p-8 flex flex-col items-center justify-center min-h-[360px] text-stone-400">
      <Loader2 className="w-6 h-6 animate-spin text-forest-700" />
      <p className="mt-3 text-xs text-stone-500">Loading sign-in portal...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] flex flex-col justify-between selection:bg-forest-100 selection:text-forest-900">
      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Subject Grounding & Value Props */}
          <div className="lg:col-span-6 space-y-6 lg:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-forest-50 text-forest-800 border border-forest-200">
              <Sparkles className="w-3.5 h-3.5 text-forest-600" aria-hidden="true" />
              <span>Healthy Drops, Healthier You</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-950 tracking-tight leading-[1.15]">
              Every morning begins with fresh nutrition.
            </h2>

            <p className="text-base text-stone-600 leading-relaxed max-w-lg">
              Fresh cut breakfast boxes delivered right to your doorstep in Bangalore. 4 varieties of fresh fruit, 2 crisp vegetables, mix salad, and sprouts prepared every dawn with CARE by Berrybeats Cafe.
            </p>

            {/* Feature Cards Grid */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg">
              <div className="p-4 rounded-2xl bg-white border border-[#E2ECE4] shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-stone-900">Doorstep Delivery</h3>
                <p className="text-xs text-stone-500 leading-normal">
                  Chilled, hygienic breakfast box arriving every morning across Bangalore.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E2ECE4] shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-stone-900">MedCity Smiles Care</h3>
                <p className="text-xs text-stone-500 leading-normal">
                  Free monthly vitals checks: Blood Sugar, Cholesterol &amp; Blood Pressure.
                </p>
              </div>
            </div>

            {/* Quote / Partner citation */}
            <div className="pt-2 border-t border-stone-200/80 max-w-lg">
              <p className="text-xs text-stone-500">
                Operational Kitchen Hub: <strong>Berrybeats Cafe</strong>, Bangalore · In partnership with <strong>MedCity Health Labs</strong>.
              </p>
            </div>
          </div>

          {/* Right Column: Custom Interactive Form */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white border border-[#E2ECE4] rounded-3xl p-6 sm:p-8 shadow-sm">
              <Suspense fallback={<FormFallback />}>
                <CustomerSignInForm />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="w-full border-t border-[#E2ECE4]/70 bg-white/40 py-6 px-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Humming Drops &amp; MedCity Smiles. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Help: 8618902810</span>
            <span>·</span>
            <span>hummingdrops@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
