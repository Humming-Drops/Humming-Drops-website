import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brain, Heart, Activity, Smile, Droplets, HeartPulse, Stethoscope, Users, Sparkles } from "lucide-react";
import { CONFIRMED_VITALS_BENEFITS } from "@/types/health";

export const metadata: Metadata = {
  title: "MedCity Smiles | Mind & Community Wellness",
  description:
    "Supportive, inspiring mental health and community space in partnership with MedCity Health Labs. Expert-led seminars, vital monitoring, and mindful coping practices.",
};

export default function MedCitySmilesPage() {
  return (
    <div className="w-full flex-1" data-theme="medcity">
      
      {/* SECTION 1: HERO */}
      <section 
        id="medcity-hero" 
        aria-label="MedCity Smiles Hero" 
        className="py-14 sm:py-16 lg:py-24 bg-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            
            {/* Left: Text Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                <span>In Collaboration with MedCity Health Labs</span>
              </div>
              
              <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold text-teal-950 tracking-tight leading-[1.1]">
                Uplifting the Mind.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A88F] to-teal-400">
                  Building a Happier Community.
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-stone-600 max-w-[640px] leading-relaxed">
                Just as Humming Drops nourishes your body, MedCity Smiles focuses on providing a supportive, inspiring space with expert-led seminars, joyful live sessions, and proactive physical & mental health monitoring.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/subscribe"
                  className="inline-flex items-center justify-center px-6 min-h-[48px] rounded-full bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-md transition-all active:scale-[0.98] w-full sm:w-auto"
                >
                  Get Started with Breakfast Box
                </Link>
                <Link
                  href="#holistic-plan"
                  className="inline-flex items-center justify-center px-6 min-h-[48px] rounded-full border-2 border-teal-700/50 hover:border-teal-700 text-teal-900 bg-teal-50 hover:bg-teal-100 font-bold transition-all active:scale-[0.98] w-full sm:w-auto"
                >
                  Our Holistic Plan
                </Link>
              </div>
            </div>

            {/* Right: Visual Cluster */}
            <div className="relative w-full h-full min-h-[300px] lg:min-h-[400px] flex items-center justify-center">
              {/* Soft ambient background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col gap-6 w-full max-w-sm mx-auto">
                <div className="flex justify-end pr-8 sm:pr-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-teal-50 border-2 border-white shadow-lg flex items-center justify-center animate-bounce-slow">
                    <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-teal-500 fill-teal-100" />
                  </div>
                </div>
                <div className="flex justify-start pl-4 sm:pl-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-2 border-teal-100 shadow-xl flex items-center justify-center z-10 -mt-4 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                    <Users className="w-10 h-10 sm:w-12 sm:h-12 text-[#00A88F]" />
                  </div>
                </div>
                <div className="flex justify-center ml-12 sm:ml-20">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 border-2 border-white shadow-md flex items-center justify-center -mt-6 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                    <Smile className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOLISTIC PLAN */}
      <section 
        id="holistic-plan" 
        aria-label="Holistic Plan" 
        className="py-14 sm:py-16 lg:py-24 bg-mint border-y border-[#E3EFE5]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold tracking-wide">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Mind and Body Health</span>
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-teal-950 tracking-tight leading-[1.15]">
              Our Holistic Plan
            </h2>
            <p className="text-base sm:text-lg text-stone-600 font-sans max-w-2xl mx-auto">
              We believe true wellness is a balance. Here is how MedCity Smiles supports both your physical vitality and your mental peace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            {/* Card 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#2BB3B1]/15 shadow-[0_8px_30px_rgba(30,43,36,0.06)] md:hover:-translate-y-1 md:hover:shadow-[0_16px_40px_rgba(30,43,36,0.12)] transition-all duration-300 flex flex-col space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-11 h-11 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-teal-300">01</span>
              </div>
              <h3 className="text-xl font-bold text-teal-950">Fuel Your Brain</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-sans">
                Eating a balanced diet supports brain health and is key to a stable mood. (That&apos;s where your Humming Drops monthly package comes in!).
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#2BB3B1]/15 shadow-[0_8px_30px_rgba(30,43,36,0.06)] md:hover:-translate-y-1 md:hover:shadow-[0_16px_40px_rgba(30,43,36,0.12)] transition-all duration-300 flex flex-col space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-11 h-11 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-teal-300">02</span>
              </div>
              <h3 className="text-xl font-bold text-teal-950">Free Health Monitoring</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-sans">
                Your membership includes free monthly checkups for Blood Sugar, Cholesterol, and Blood Pressure powered by MedCity Health Labs.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#2BB3B1]/15 shadow-[0_8px_30px_rgba(30,43,36,0.06)] md:hover:-translate-y-1 md:hover:shadow-[0_16px_40px_rgba(30,43,36,0.12)] transition-all duration-300 flex flex-col space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-11 h-11 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <Smile className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-teal-300">03</span>
              </div>
              <h3 className="text-xl font-bold text-teal-950">Cultivate Positive Self-Talk</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-sans">
                Challenge negative thoughts and replace them with realistic, kind ones. Celebrate small achievements and be compassionate with yourself.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#2BB3B1]/15 shadow-[0_8px_30px_rgba(30,43,36,0.06)] md:hover:-translate-y-1 md:hover:shadow-[0_16px_40px_rgba(30,43,36,0.12)] transition-all duration-300 flex flex-col space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-11 h-11 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-teal-300">04</span>
              </div>
              <h3 className="text-xl font-bold text-teal-950">Happy-Healthy Coping Mechanisms</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-sans">
                Engage in movement, practice mindfulness, use creative outlets, and participate in joyful live community shares.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HEALTH MONITORING */}
      <section 
        id="vitals" 
        aria-label="Health Monitoring" 
        className="py-14 sm:py-16 lg:py-24 bg-white"
      >
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
              Because caring for your mind starts with knowing your body. These vitals are monitored monthly for every Humming Drops subscriber.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            {CONFIRMED_VITALS_BENEFITS.map((v, i) => {
              // Map metric name to specific icons
              const Icon = v.metricName.toLowerCase().includes('blood sugar') 
                ? Droplets 
                : v.metricName.toLowerCase().includes('cholesterol') 
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
                  <h3 className="font-extrabold text-xl text-teal-950">
                    {v.metricName}
                  </h3>
                  <p className="text-sm text-stone-600 font-sans leading-relaxed">
                    {v.purpose}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
