"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  LogOut,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OFFICIAL_PLANS, PlanTier } from "@/types/plans";

export default function DashboardSettingsPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("Subscriber");
  const [customerPhone, setCustomerPhone] = useState("+91 8618902810");
  const [customerEmail, setCustomerEmail] = useState("subscriber@example.com");
  const [refCode, setRefCode] = useState("HD-REG-2026-94182");

  const [deliveryAddress, setDeliveryAddress] = useState({
    flatNo: "Flat 402",
    buildingName: "Oakwood Palms",
    streetAddress: "14th Main Road, HAL 2nd Stage",
    area: "Indiranagar",
    city: "Bangalore",
    pincode: "560038",
  });

  const [activePlanId, setActivePlanId] = useState<PlanTier>("premium");
  const [profileSaved, setProfileSaved] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [planUpdatedToast, setPlanUpdatedToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hd_subscriber_session");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.customerName) setCustomerName(data.customerName);
        if (data.customerPhone) setCustomerPhone(data.customerPhone);
        if (data.customerEmail) setCustomerEmail(data.customerEmail);
        if (data.referenceCode) setRefCode(data.referenceCode);
        if (data.planId === "standard" || data.planId === "premium") {
          setActivePlanId(data.planId);
        } else if (data.planName?.toLowerCase().includes("standard")) {
          setActivePlanId("standard");
        } else {
          setActivePlanId("premium");
        }
        if (data.deliveryAddress) {
          setDeliveryAddress((prev) => ({ ...prev, ...data.deliveryAddress }));
        }
      }
    } catch {}
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);

    try {
      const raw = localStorage.getItem("hd_subscriber_session");
      const current = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        "hd_subscriber_session",
        JSON.stringify({
          ...current,
          customerName,
          customerPhone,
          customerEmail,
        })
      );
    } catch {}
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 3000);

    try {
      const raw = localStorage.getItem("hd_subscriber_session");
      const current = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        "hd_subscriber_session",
        JSON.stringify({
          ...current,
          deliveryAddress,
        })
      );
    } catch {}
  };

  const handleSwitchPlan = (planKey: PlanTier) => {
    setActivePlanId(planKey);
    const planName = planKey === "standard" ? "Standard Morning Box" : "Premium Morning Box";
    setPlanUpdatedToast(
      `Plan switched to ${planName} (₹${OFFICIAL_PLANS[planKey].monthlyPriceINR.toLocaleString("en-IN")}/month)!`
    );
    setTimeout(() => setPlanUpdatedToast(null), 4000);

    try {
      const raw = localStorage.getItem("hd_subscriber_session");
      const current = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        "hd_subscriber_session",
        JSON.stringify({
          ...current,
          planId: planKey,
          planName,
        })
      );
    } catch {}
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem("hd_subscriber_session");
    } catch {}
    router.push("/login");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line-subtle">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200">
              Account Management
            </span>
            <span className="text-xs text-content-muted font-mono">{refCode}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary">
            Settings &amp; Subscription Details
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary font-sans">
            Update your profile, delivery destination in Bangalore, or manage your subscription tier.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition text-xs font-semibold self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Plan switch toast */}
      {planUpdatedToast && (
        <div className="p-4 rounded-2xl bg-forest-900 text-white shadow-lg text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{planUpdatedToast}</span>
          </div>
          <button
            onClick={() => setPlanUpdatedToast(null)}
            className="text-stone-300 hover:text-white font-semibold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SUBSCRIPTION PLAN SELECTION MATRIX */}
      <div className="p-6 rounded-3xl bg-surface border border-line-subtle shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-forest-700" />
              <h2 className="font-display font-bold text-base text-content-primary">
                Active Subscription Plan
              </h2>
            </div>
            <p className="text-xs text-content-secondary">
              Direct monthly pricing from official brochure. Switch your tier anytime.
            </p>
          </div>
          <Badge className="bg-forest-100 text-forest-800 text-xs self-start sm:self-auto">
            Doorstep Delivery Every Morning
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* STANDARD PLAN */}
          <div
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activePlanId === "standard"
                ? "border-forest-600 bg-forest-50/50 ring-2 ring-forest-500/20"
                : "border-line-subtle hover:border-forest-300"
            }`}
            onClick={() => handleSwitchPlan("standard")}
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-base text-stone-900">
                Standard Plan
              </span>
              {activePlanId === "standard" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-800 text-white">
                  Active
                </span>
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-mono text-2xl font-extrabold text-forest-900">
                ₹3,500
              </span>
              <span className="text-xs text-stone-500">/ month</span>
            </div>
            <p className="text-xs text-stone-600 mt-2">
              4 Fruits + 2 Veg + Mix Salad + Sprouts every day + Dry Fruits 3 days/week + Free MedCity Smiles &amp; Monthly Health Checkup.
            </p>
          </div>

          {/* PREMIUM PLAN */}
          <div
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activePlanId === "premium"
                ? "border-forest-600 bg-forest-50/50 ring-2 ring-forest-500/20"
                : "border-line-subtle hover:border-forest-300"
            }`}
            onClick={() => handleSwitchPlan("premium")}
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-base text-stone-900 flex items-center gap-1.5">
                <span>Premium Plan</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Recommended
                </span>
              </span>
              {activePlanId === "premium" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-800 text-white">
                  Active
                </span>
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-mono text-2xl font-extrabold text-forest-900">
                ₹4,000
              </span>
              <span className="text-xs text-stone-500">/ month</span>
            </div>
            <p className="text-xs text-stone-600 mt-2">
              Everything in Standard + <strong>Daily Dry Fruits</strong> + Special Curated Healthy Juice Drops + Exclusive MedCity Labs Discounts.
            </p>
          </div>
        </div>
      </div>

      {/* TWO COLUMN: PROFILE & BANGALORE DELIVERY ADDRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <div className="p-6 rounded-3xl bg-surface border border-line-subtle shadow-card space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-forest-700" />
              <h2 className="font-display font-bold text-base text-content-primary">
                Contact &amp; Personal Info
              </h2>
            </div>
            <p className="text-xs text-content-secondary">
              Used for morning delivery dispatches and monthly health checkup coordination.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-line-subtle text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
                Mobile Number (Primary Delivery WhatsApp)
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-line-subtle text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-forest-600 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-line-subtle text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            {profileSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profile information updated successfully!</span>
              </div>
            )}

            <Button
              type="submit"
              brand="humming"
              variant="primary"
              size="sm"
              className="rounded-full px-5 text-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              <span>Save Contact Details</span>
            </Button>
          </form>
        </div>

        {/* Bangalore Delivery Address Form */}
        <div className="p-6 rounded-3xl bg-surface border border-line-subtle shadow-card space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-forest-700" />
              <h2 className="font-display font-bold text-base text-content-primary">
                Bangalore Delivery Address
              </h2>
            </div>
            <p className="text-xs text-content-secondary">
              Morning doorstep deliveries are dispatched from Berrybeats Cafe, Bangalore.
            </p>
          </div>

          <form onSubmit={handleSaveAddress} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
                  Flat / House #
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress.flatNo}
                  onChange={(e) =>
                    setDeliveryAddress({ ...deliveryAddress, flatNo: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-line-subtle text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
                  Building / Apartment
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress.buildingName}
                  onChange={(e) =>
                    setDeliveryAddress({ ...deliveryAddress, buildingName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-line-subtle text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
                Street Address
              </label>
              <input
                type="text"
                required
                value={deliveryAddress.streetAddress}
                onChange={(e) =>
                  setDeliveryAddress({ ...deliveryAddress, streetAddress: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-line-subtle text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
                  Area / Locality
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress.area}
                  onChange={(e) =>
                    setDeliveryAddress({ ...deliveryAddress, area: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-line-subtle text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider">
                  Bangalore Pincode
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress.pincode}
                  onChange={(e) =>
                    setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-line-subtle text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-forest-600 font-mono"
                />
              </div>
            </div>

            {addressSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Delivery address updated successfully!</span>
              </div>
            )}

            <Button
              type="submit"
              brand="humming"
              variant="secondary"
              size="sm"
              className="rounded-full px-5 text-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1 text-forest-700" />
              <span>Update Delivery Location</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
