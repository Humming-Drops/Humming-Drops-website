"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Phone, User, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter your registered mobile number, email, or HD reference code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Save active subscriber session to localStorage for portal hydration
    const sessionData = {
      isAuthenticated: true,
      identifier: identifier.trim(),
      customerName: identifier.includes("@") ? identifier.split("@")[0] : "Bangalore Subscriber",
      planId: "premium",
      planName: "Premium Morning Box",
      referenceCode: identifier.startsWith("HD-") ? identifier.toUpperCase() : "HD-REG-2026-88421",
      deliveryAddress: "Flat 402, Green Glen Layout, Bellandur, Bangalore - 560103",
      loginTime: new Date().toISOString(),
    };

    try {
      localStorage.setItem("hd_subscriber_session", JSON.stringify(sessionData));
    } catch {}

    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard/overview");
    }, 600);
  };

  const handleDemoSignIn = () => {
    setIdentifier("9876543210");
    setPassword("demo1234");
    setIsLoading(true);

    const demoSession = {
      isAuthenticated: true,
      identifier: "9876543210",
      customerName: "Rahul Sharma",
      planId: "premium",
      planName: "Premium Morning Box",
      referenceCode: "HD-REG-2026-94182",
      deliveryAddress: "Flat 304, Palm Meadows, Whitefield, Bangalore - 560066",
      loginTime: new Date().toISOString(),
    };

    try {
      localStorage.setItem("hd_subscriber_session", JSON.stringify(demoSession));
    } catch {}

    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard/overview");
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-forest-700" aria-hidden="true" />
          <span>Subscriber Portal</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-stone-900 tracking-tight">
          Subscriber Sign In
        </h1>
        <p className="text-xs text-stone-500 font-sans">
          Manage your daily morning box delivery, pause vacation dates, and check monthly health vitals.
        </p>
      </div>

      <form onSubmit={handleSignIn} className="p-7 rounded-3xl border border-stone-200 bg-white space-y-4 shadow-xs">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-sans">
            {error}
          </div>
        )}

        <div className="space-y-1.5 text-xs text-stone-600 font-sans">
          <label htmlFor="identifier" className="font-semibold text-stone-700">
            Mobile Number, Email or Reference Code
          </label>
          <div className="relative">
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 9876543210 or HD-REG-..."
              className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 transition"
            />
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-stone-600 font-sans">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="font-semibold text-stone-700">
              Password or OTP
            </label>
            <Link href="/forgot-password" className="text-forest-700 hover:underline text-[11px]">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 transition"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
          className="w-full py-3 rounded-full bg-forest-900 text-white font-semibold text-xs hover:bg-forest-800 transition"
        >
          {isLoading ? "Signing in..." : "Sign In to Dashboard →"}
        </Button>

        {/* Demo Fast Sign-In */}
        <div className="pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2 px-3 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-teal-100/60 text-teal-900 text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <span>Preview with Demo Subscriber Account</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </form>

      <div className="text-center text-xs text-stone-500 font-sans">
        Don&apos;t have an active subscription yet?{" "}
        <Link href="/subscribe" className="text-forest-800 font-semibold hover:underline">
          Subscribe to a Plan
        </Link>
      </div>
    </div>
  );
}
