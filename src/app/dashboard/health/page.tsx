"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  Calendar,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  UserCheck,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONFIRMED_VITALS_BENEFITS } from "@/types/health";

export default function DashboardHealthPage() {
  const [selectedTab, setSelectedTab] = useState<"latest" | "history">("latest");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("08:00 AM - 09:30 AM");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookCheckup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) return;
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsBookingOpen(false);
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line-subtle">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
              MedCity Health Labs Partner Network
            </span>
            <span className="text-xs text-teal-700 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> HIPAA &amp; RLS Protected
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-teal-950">
            Monthly Health Vitals Record
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans">
            Track your 3 complimentary monthly clinical checkups included with your Humming Drops subscription.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setIsBookingOpen(true)}
          brand="medcity"
          variant="primary"
          size="md"
          className="rounded-full px-5 text-xs whitespace-nowrap self-start sm:self-auto bg-teal-800 hover:bg-teal-900 shadow-sm"
        >
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          <span>Book Free Monthly Screening</span>
        </Button>
      </div>

      {/* Security & Lab Accreditation Banner */}
      <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-teal-950">
              Verified Partner: MedCity Health Labs (NABL Accredited Partner)
            </p>
            <p className="text-[11px] text-teal-800">
              All blood sugar, cholesterol, and blood pressure tests are processed in certified partner facilities. Your health vitals are cryptographically isolated and never shared.
            </p>
          </div>
        </div>
        <Badge className="bg-teal-200/70 text-teal-900 border-teal-300 text-[10px] shrink-0 self-start sm:self-auto">
          100% Free With Subscription
        </Badge>
      </div>

      {/* THE 3 CONFIRMED BROCHURE VITALS METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Blood Sugar */}
        <div className="p-6 rounded-3xl bg-surface border border-teal-100 shadow-card hover:border-teal-300 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-teal-100/70 flex items-center justify-center text-teal-800">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Optimal
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="font-display font-bold text-base text-stone-900">
              Blood Sugar Check
            </h2>
            <p className="text-xs text-stone-500">
              Fasting &amp; Post-Prandial Glycemic Index
            </p>
          </div>

          <div className="pt-2 border-t border-teal-50 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-600">Fasting:</span>
              <span className="font-mono text-sm font-bold text-teal-950">92 mg/dL</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-600">Post-Prandial:</span>
              <span className="font-mono text-sm font-bold text-teal-950">124 mg/dL</span>
            </div>
            <div className="text-[10px] text-stone-400">
              Standard clinical range: Fasting 70–99 mg/dL
            </div>
          </div>
        </div>

        {/* Metric 2: Total Cholesterol */}
        <div className="p-6 rounded-3xl bg-surface border border-teal-100 shadow-card hover:border-teal-300 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-teal-100/70 flex items-center justify-center text-teal-800">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Desirable
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="font-display font-bold text-base text-stone-900">
              Cholesterol Profile
            </h2>
            <p className="text-xs text-stone-500">
              Lipid Screen &amp; Vascular Wellness
            </p>
          </div>

          <div className="pt-2 border-t border-teal-50 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-600">Total Cholesterol:</span>
              <span className="font-mono text-sm font-bold text-teal-950">176 mg/dL</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-600">HDL (Good):</span>
              <span className="font-mono text-sm font-bold text-teal-950">54 mg/dL</span>
            </div>
            <div className="text-[10px] text-stone-400">
              Desirable total level: &lt; 200 mg/dL
            </div>
          </div>
        </div>

        {/* Metric 3: Blood Pressure */}
        <div className="p-6 rounded-3xl bg-surface border border-teal-100 shadow-card hover:border-teal-300 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-teal-100/70 flex items-center justify-center text-teal-800">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Normal
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="font-display font-bold text-base text-stone-900">
              Blood Pressure
            </h2>
            <p className="text-xs text-stone-500">
              Systolic &amp; Diastolic Arterial Pressure
            </p>
          </div>

          <div className="pt-2 border-t border-teal-50 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-600">Reading:</span>
              <span className="font-mono text-sm font-bold text-teal-950">118 / 78 mmHg</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-600">Resting Pulse:</span>
              <span className="font-mono text-sm font-bold text-teal-950">72 bpm</span>
            </div>
            <div className="text-[10px] text-stone-400">
              Optimal standard: &lt; 120/80 mmHg
            </div>
          </div>
        </div>
      </div>

      {/* HISTORICAL CHECKUP RECORDS */}
      <div className="p-6 rounded-3xl bg-surface border border-line-subtle shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-base text-stone-900">
              Clinical Checkup History
            </h2>
            <p className="text-xs text-stone-500">
              Monthly preventative records provided by MedCity Health Labs.
            </p>
          </div>
          <Badge className="bg-stone-100 text-stone-700 text-xs self-start sm:self-auto">
            1 Checkup Completed · Next Eligible Now
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Tests Conducted</th>
                <th className="py-3 px-4">Clinical Status</th>
                <th className="py-3 px-4">Lab Doctor</th>
                <th className="py-3 px-4 text-right">Report Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              <tr className="hover:bg-teal-50/20 transition-colors">
                <td className="py-3.5 px-4 font-mono font-medium">15 Oct 2026</td>
                <td className="py-3.5 px-4 font-medium">
                  Sugar (F/PP), Total Cholesterol, BP
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                    All Vitals Normal
                  </span>
                </td>
                <td className="py-3.5 px-4 text-stone-600">Dr. S. Menon (MedCity Labs)</td>
                <td className="py-3.5 px-4 text-right">
                  <a
                    href="#report"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Downloading verified lab summary PDF report...");
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-teal-800 hover:text-teal-900 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF Report</span>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SCHEDULE MODAL */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-md w-full p-6 shadow-2xl border border-teal-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-700" />
                <h3 className="font-display font-bold text-base text-stone-900">
                  Book Free Monthly Screening
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Schedule your free monthly Blood Sugar, Cholesterol &amp; Blood Pressure checkup at MedCity Health Labs.
            </p>

            {bookingSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Screening appointment confirmed! Lab team will contact you.</span>
              </div>
            ) : (
              <form onSubmit={handleBookCheckup} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
                    Preferred Screening Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
                    Morning Fasting Slot
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="07:30 AM - 08:30 AM">07:30 AM - 08:30 AM (Fasting)</option>
                    <option value="08:30 AM - 09:30 AM">08:30 AM - 09:30 AM (Fasting)</option>
                    <option value="09:30 AM - 10:30 AM">09:30 AM - 10:30 AM (Fasting)</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-teal-50 border border-teal-100 text-[11px] text-teal-900">
                  Includes: 1. Fasting Blood Sugar, 2. Lipid Panel / Total Cholesterol, 3. Blood Pressure checkup.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    brand="medcity"
                    variant="primary"
                    size="md"
                    className="rounded-full px-5 text-xs bg-teal-800 hover:bg-teal-900"
                  >
                    Confirm Appointment
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Advisory Note */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500 space-y-1">
        <span className="font-semibold text-stone-700">Clinical Advisory Disclaimer:</span>
        <p>
          Preventative vitals screening provided in collaboration with MedCity Health Labs. This preventative health benefit is designed to monitor wellbeing trends and encourage preventative care. It does not replace comprehensive diagnosis or acute physician treatment.
        </p>
      </div>
    </div>
  );
}
