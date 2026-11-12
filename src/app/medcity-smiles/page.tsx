import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Activity,
  Smile,
  Droplets,
  HeartPulse,
  Stethoscope,
  Users,
  Sparkles,
  PhoneCall,
} from "lucide-react";
import { CONFIRMED_VITALS_BENEFITS } from "@/types/health";

export const metadata: Metadata = {
  title: "MedCity Smiles | Mind & Community Wellness",
  description:
    "Supportive, community-first wellness in partnership with MedCity Health Labs. Free monthly health checkups and access to a community of doctors and clinical nutritionists, included with every Humming Drops plan.",
};

const WHY_MEDCITY = [
  {
    id: "membership",
    icon: Heart,
    title: "Free With Every Plan",
    copy: "MedCity Smiles membership is included free with both the Standard and Premium Humming Drops subscriptions.",
  },
  {
    id: "checkups",
    icon: Stethoscope,
    title: "Preventative, Not Reactive",
    copy: "A free monthly checkup — blood sugar, cholesterol, blood pressure — monitored by our community of doctors and clinical nutritionists.",
  },
  {
    id: "doctors",
    icon: Users,
    title: "A Real Community of Experts",
    copy: "Access to a community of doctors and clinical nutritionists who monitor your vitals and advise on your wellness journey.",
  },
];

export default function MedCitySmilesPage() {
  return (
    <div className="w-full flex-1" data-theme="medcity">
      {/* SECTION 1: HERO */}
      <section
        id="medcity-hero"
        aria-label="MedCity Smiles Hero"
        className="py-14 sm:py-16 lg:py-24 bg-gradient-to-b from-[#F8FAF9] to-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6 text-center mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              <span>In Collaboration with MedCity Health Labs</span>
            </div>

            <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold text-teal-950 tracking-tight leading-[1.1]">
              Nourishing the Body.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A88F] to-teal-400">
                Uplifting the Mind.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              MedCity Smiles is the community side of Humming Drops — free preventative health monitoring and
              access to doctors and clinical nutritionists, included with your daily breakfast box subscription.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center">
              <Link
                href="/subscribe"
                className="inline-flex items-center justify-center gap-2 px-6 min-h-[48px] rounded-full bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-md transition-all active:scale-[0.98] w-full sm:w-auto"
              >
                <span>Get Started with Breakfast Box</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="#vitals"
                className="inline-flex items-center justify-center px-6 min-h-[48px] rounded-full border-2 border-teal-700/50 hover:border-teal-700 text-teal-900 bg-teal-50 hover:bg-teal-100 font-bold transition-all active:scale-[0.98] w-full sm:w-auto"
              >
                See What&apos;s Included
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY MEDCITY SMILES */}
      <section
        id="why-medcity"
        aria-label="Why MedCity Smiles"
        className="py-14 sm:py-16 lg:py-24 bg-mint border-y border-[#E3EFE5]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold tracking-wide">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Mind and Body Health</span>
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-teal-950 tracking-tight leading-[1.15]">
              Why MedCity Smiles
            </h2>
            <p className="text-base sm:text-lg text-stone-600 font-sans max-w-2xl mx-auto">
              Real wellness is both physical and mental. Here is exactly what membership gives you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            {WHY_MEDCITY.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white border border-[#2BB3B1]/15 shadow-[0_8px_30px_rgba(30,43,36,0.06)] md:hover:-translate-y-1 md:hover:shadow-[0_16px_40px_rgba(30,43,36,0.12)] transition-all duration-300 flex flex-col space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-11 h-11 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-teal-300">0{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-teal-950">{item.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed font-sans">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: HEALTH MONITORING */}
      <section id="vitals" aria-label="Health Monitoring" className="py-14 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold tracking-wide">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>Included Free</span>
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-teal-950 tracking-tight leading-[1.15]">
              Exclusive Monthly Health Monitoring
            </h2>
            <p className="text-base sm:text-lg text-stone-600 font-sans max-w-2xl mx-auto">
              Because caring for your mind starts with knowing your body. These vitals are monitored monthly for
              every Humming Drops subscriber.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            {CONFIRMED_VITALS_BENEFITS.map((v, i) => {
              const Icon = v.metricName.toLowerCase().includes("blood sugar")
                ? Droplets
                : v.metricName.toLowerCase().includes("cholesterol")
                  ? Heart
                  : HeartPulse;

              return (
                <div
                  key={i}
                  className="p-6 sm:p-8 rounded-3xl bg-white border border-[#2BB3B1]/15 shadow-[0_8px_30px_rgba(30,43,36,0.06)] md:hover:-translate-y-1 md:hover:shadow-[0_16px_40px_rgba(30,43,36,0.12)] transition-all duration-300 flex flex-col space-y-3"
                >
                  <div className="w-11 h-11 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold uppercase text-teal-600 tracking-wider">
                    {v.frequency} Checkup
                  </div>
                  <h3 className="font-extrabold text-xl text-teal-950">{v.metricName}</h3>
                  <p className="text-sm text-stone-600 font-sans leading-relaxed">{v.purpose}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: COMMUNITY CTA */}
      <section
        id="community-cta"
        aria-label="Join the MedCity Smiles Community"
        className="py-14 sm:py-16 lg:py-20 bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 text-white"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-wide">
            <Smile className="w-3.5 h-3.5 text-amber-300" />
            <span>Free With Every Plan</span>
          </div>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold tracking-tight leading-[1.16]">
            Join MedCity Smiles — Free With Your Subscription
          </h2>
          <p className="text-sm sm:text-base text-teal-50/90 max-w-2xl mx-auto leading-relaxed">
            Subscribe to a Humming Drops breakfast box and your MedCity Smiles membership — free monthly checkups
            and access to our community of doctors and nutritionists — comes included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center gap-2 px-6 min-h-[48px] rounded-full bg-white text-teal-900 font-extrabold shadow-md hover:bg-teal-50 transition-all active:scale-[0.98]"
            >
              <span>Subscribe Now</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <a
              href="tel:8618902810"
              className="inline-flex items-center justify-center gap-2 px-6 min-h-[48px] rounded-full border-2 border-white/40 hover:border-white text-white font-bold transition-all active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4" aria-hidden="true" />
              <span>Call: 8618902810</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
