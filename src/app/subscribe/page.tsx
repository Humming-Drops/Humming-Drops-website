"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Copy,
  Sparkles,
  Leaf,
  Info,
} from "lucide-react";
import { OFFICIAL_PLANS, PlanTier } from "@/types/plans";
import { DietaryType } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";

interface ConfirmationData {
  leadReferenceCode: string;
  status: string;
  hasActivePerks: boolean;
  plan: {
    id: string;
    name: string;
    monthlyPriceINR: number;
  };
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  deliveryAddress: {
    flatNo: string;
    buildingName: string;
    streetAddress: string;
    area: string;
    city: string;
    pincode: string;
    deliveryNotes?: string;
  };
  dietaryPreferences: {
    dietaryType: DietaryType;
    allergies: string[];
    notes?: string;
  };
  whatsappRedirectUrl: string;
  createdAt: string;
}

const COMMON_ALLERGIES = [
  "Peanuts & Tree Nuts",
  "Dairy / Lactose",
  "Gluten / Wheat",
  "Citrus Fruits",
  "Soy",
  "Raw Papaya",
];

export default function SubscribePage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isPending, startTransition] = useTransition();

  const [selectedPlanId, setSelectedPlanId] = useState<PlanTier>("premium");

  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const [deliveryAddress, setDeliveryAddress] = useState({
    flatNo: "",
    buildingName: "",
    streetAddress: "",
    area: "",
    city: "Bangalore",
    pincode: "",
    deliveryNotes: "",
  });

  const [dietaryPreferences, setDietaryPreferences] = useState<{
    dietaryType: DietaryType;
    allergies: string[];
    notes: string;
  }>({
    dietaryType: "standard",
    allergies: [],
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!selectedPlanId || !OFFICIAL_PLANS[selectedPlanId]) {
        newErrors.plan = "Please select a subscription plan.";
      }
    } else if (step === 2) {
      if (!customer.fullName.trim() || customer.fullName.trim().length < 2) {
        newErrors.fullName = "Please enter your full name (minimum 2 characters).";
      }
      const cleanPhone = customer.phone.replace(/[\s\-\(\)\+]/g, "").replace(/^91/, "").replace(/^0/, "");
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        newErrors.phone = "Please enter a valid 10-digit Indian mobile number.";
      }
      if (!customer.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    } else if (step === 3) {
      if (!deliveryAddress.flatNo.trim()) {
        newErrors.flatNo = "Flat / Apartment number is required.";
      }
      if (!deliveryAddress.buildingName.trim()) {
        newErrors.buildingName = "Building or society name is required.";
      }
      if (!deliveryAddress.streetAddress.trim()) {
        newErrors.streetAddress = "Street address is required.";
      }
      if (!deliveryAddress.area.trim()) {
        newErrors.area = "Area or neighborhood in Bangalore is required.";
      }
      if (!/^[1-9][0-9]{5}$/.test(deliveryAddress.pincode.trim())) {
        newErrors.pincode = "Please enter a valid 6-digit postal pincode.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setSubmitError(null);
      setCurrentStep((prev) => Math.min(prev + 1, 5) as 1 | 2 | 3 | 4 | 5);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1) as 1 | 2 | 3 | 4 | 5);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const toggleAllergy = (allergy: string) => {
    setDietaryPreferences((prev) => {
      const exists = prev.allergies.includes(allergy);
      return {
        ...prev,
        allergies: exists ? prev.allergies.filter((a) => a !== allergy) : [...prev.allergies, allergy],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setSubmitError("Please complete all required fields before submitting.");
      return;
    }

    setSubmitError(null);

    startTransition(async () => {
      try {
        const payload = {
          planId: selectedPlanId,
          customer: {
            fullName: customer.fullName.trim(),
            phone: customer.phone.trim(),
            email: customer.email.trim(),
          },
          deliveryAddress: {
            flatNo: deliveryAddress.flatNo.trim(),
            buildingName: deliveryAddress.buildingName.trim(),
            streetAddress: deliveryAddress.streetAddress.trim(),
            area: deliveryAddress.area.trim(),
            city: "Bangalore",
            pincode: deliveryAddress.pincode.trim(),
            deliveryNotes: deliveryAddress.deliveryNotes.trim() || undefined,
          },
          dietaryPreferences: {
            dietaryType: dietaryPreferences.dietaryType,
            allergies: dietaryPreferences.allergies,
            notes: dietaryPreferences.notes.trim() || undefined,
          },
        };

        const res = await fetch("/api/subscriptions/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to submit subscription registration.");
        }

        setConfirmationData(data);
        window.scrollTo({ top: 80, behavior: "smooth" });
      } catch (err: any) {
        setSubmitError(err.message || "An unexpected error occurred. Please try again.");
      }
    });
  };

  const handleCopyReference = () => {
    if (confirmationData?.leadReferenceCode) {
      navigator.clipboard.writeText(confirmationData.leadReferenceCode);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  const activePlan = OFFICIAL_PLANS[selectedPlanId];
  if (confirmationData) {
    return (
      <div className="min-h-screen bg-[#fcfaf5] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="border-forest-900/10 shadow-lg bg-white overflow-hidden text-center p-8 sm:p-10 space-y-6">
            <div className="w-16 h-16 rounded-full bg-forest-50 border-2 border-forest-900/20 text-forest-800 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9 text-forest-700" />
            </div>

            <div className="space-y-2">
              <Badge variant="warning" size="md" className="uppercase tracking-wider">
                Registration Received · Pending Confirmation
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-display">
                Welcome to Humming Drops!
              </h1>
              <p className="text-stone-600 text-sm max-w-md mx-auto">
                Thank you, <strong className="text-stone-800">{confirmationData.customer.fullName}</strong>. Your breakfast box registration has been received by our Bangalore kitchen coordinator.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-forest-50/60 border border-forest-900/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <span className="text-[11px] font-bold text-forest-800 uppercase tracking-wider block">
                  Lead Reference Code
                </span>
                <span className="font-mono text-xl font-extrabold text-forest-900 tracking-wider">
                  {confirmationData.leadReferenceCode}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyReference}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-forest-900/20 text-forest-900 hover:bg-forest-50 transition-colors shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedRef ? "Copied to Clipboard!" : "Copy Code"}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs text-left flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Registration Status: Not Yet Active</strong>
                Per our Bangalore delivery policy, subscriptions start only after our coordinator confirms your morning delivery route and time slot. No payment was charged today.
              </div>
            </div>

            <div className="border-t border-stone-100 pt-6 text-left space-y-3 text-xs text-stone-700">
              <h3 className="font-bold text-sm text-stone-900 font-display">Registration Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200/60">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Selected Plan</span>
                  <span className="font-bold text-forest-900 text-sm">
                    {confirmationData.plan.name} Plan
                  </span>
                  <span className="text-stone-500 block">₹{confirmationData.plan.monthlyPriceINR}/month</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Contact Phone</span>
                  <span className="font-semibold text-stone-800">{confirmationData.customer.phone}</span>
                  <span className="text-stone-500 block truncate">{confirmationData.customer.email}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Delivery Destination</span>
                  <span className="font-medium text-stone-800">
                    {confirmationData.deliveryAddress.flatNo}, {confirmationData.deliveryAddress.buildingName},{" "}
                    {confirmationData.deliveryAddress.streetAddress}, {confirmationData.deliveryAddress.area},{" "}
                    Bangalore - {confirmationData.deliveryAddress.pincode}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={confirmationData.whatsappRedirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md transition-transform hover:-translate-y-0.5"
              >
                <span>Chat with Bangalore Team on WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-[11px] text-stone-500">
                Official coordinator helpline: <strong>+91 {OFFICIAL_CONTACT.phone}</strong> · Kitchen: {OFFICIAL_CONTACT.kitchenLocation}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-900 underline-offset-4 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#fcfaf5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 bg-forest-50 px-3.5 py-1 rounded-full border border-forest-900/10">
            <Sparkles className="w-3.5 h-3.5 text-forest-600" />
            <span>Bangalore Breakfast Box Onboarding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 font-display tracking-tight">
            Begin Your Morning Habit
          </h1>
          <p className="text-sm text-stone-600 max-w-lg mx-auto">
            5 fresh compartments delivered every morning from Berrybeats cafe, Bangalore.
          </p>
        </div>

        <nav aria-label="Onboarding Progress" className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200/80 shadow-sm">
          <ol className="grid grid-cols-5 gap-1 sm:gap-2 text-center text-xs font-semibold">
            {[
              { step: 1, label: "Plan" },
              { step: 2, label: "Contact" },
              { step: 3, label: "Address" },
              { step: 4, label: "Diet" },
              { step: 5, label: "Review" },
            ].map(({ step, label }) => {
              const isCurrent = currentStep === step;
              const isCompleted = currentStep > step;
              return (
                <li
                  key={step}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-1.5 rounded-xl transition-colors ${
                    isCurrent
                      ? "bg-forest-50 text-forest-900 font-bold border border-forest-900/20"
                      : isCompleted
                      ? "text-forest-800"
                      : "text-stone-400"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? "bg-forest-900 text-white"
                        : isCompleted
                        ? "bg-forest-800 text-white"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3" /> : step}
                  </span>
                  <span className="text-[11px] sm:text-xs">{label}</span>
                </li>
              );
            })}
          </ol>
        </nav>

        <Card className="bg-white border-stone-200 shadow-md p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                    Step 1 of 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                    Select Your Monthly Plan
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Choose the subscription tier that best fits your morning routine.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div
                    onClick={() => setSelectedPlanId("standard")}
                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      selectedPlanId === "standard"
                        ? "border-forest-900 bg-forest-50/20 shadow-md ring-2 ring-forest-900/10"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-base text-forest-900">
                          {OFFICIAL_PLANS.standard.name} Plan
                        </h3>
                        <span className="font-extrabold text-forest-900 text-lg">
                          ₹{OFFICIAL_PLANS.standard.monthlyPriceINR}
                          <span className="text-xs text-stone-500 font-normal">/mo</span>
                        </span>
                      </div>
                      <span className="inline-block text-[11px] font-semibold text-forest-800 bg-forest-50 px-2 py-0.5 rounded-full">
                        ~₹{OFFICIAL_PLANS.standard.perDayPriceINR} / day
                      </span>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {OFFICIAL_PLANS.standard.tagline}
                      </p>
                    </div>

                    <ul className="space-y-1.5 text-xs text-stone-700 border-t border-stone-100 pt-3">
                      {OFFICIAL_PLANS.standard.boxInclusions.map((inc, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                          <span>{inc.title} ({inc.frequency})</span>
                        </li>
                      ))}
                      <li className="flex items-center gap-2 text-forest-800 font-medium">
                        <Check className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                        <span>Free MedCity Smiles Membership & Monthly Health Checkup</span>
                      </li>
                    </ul>
                  </div>

                  <div
                    onClick={() => setSelectedPlanId("premium")}
                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      selectedPlanId === "premium"
                        ? "border-forest-900 bg-forest-50/30 shadow-md ring-2 ring-forest-900/15"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div className="absolute -top-3 right-4">
                      <span className="bg-forest-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                        Client Favorite
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-base text-forest-900">
                          {OFFICIAL_PLANS.premium.name} Plan
                        </h3>
                        <span className="font-extrabold text-forest-900 text-lg">
                          ₹{OFFICIAL_PLANS.premium.monthlyPriceINR}
                          <span className="text-xs text-stone-500 font-normal">/mo</span>
                        </span>
                      </div>
                      <span className="inline-block text-[11px] font-semibold text-forest-800 bg-forest-50 px-2 py-0.5 rounded-full">
                        ~₹{OFFICIAL_PLANS.premium.perDayPriceINR} / day
                      </span>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {OFFICIAL_PLANS.premium.tagline}
                      </p>
                    </div>

                    <ul className="space-y-1.5 text-xs text-stone-700 border-t border-stone-100 pt-3">
                      {OFFICIAL_PLANS.premium.boxInclusions.map((inc, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                          <span className={inc.isPremiumOnly ? "font-bold text-forest-900" : ""}>
                            {inc.title} ({inc.frequency})
                          </span>
                        </li>
                      ))}
                      <li className="flex items-center gap-2 text-forest-900 font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Special Curated Juice Drops by CARE by Berrybeats</span>
                      </li>
                      <li className="flex items-center gap-2 text-forest-900 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span>Exclusive MedCity Labs Package Discounts</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                    Step 2 of 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                    Your Contact Details
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600">
                    We will use this phone number for your morning delivery WhatsApp coordination.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label htmlFor="fullName" className="block text-xs font-bold text-stone-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={customer.fullName}
                        onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                        placeholder="e.g. Aditi Rao"
                        className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border font-sans focus:outline-none focus:ring-2 ${
                          errors.fullName
                            ? "border-red-400 focus:ring-red-200"
                            : "border-stone-300 focus:ring-forest-900/20 focus:border-forest-900"
                        }`}
                      />
                    </div>
                    {errors.fullName && <p className="text-[11px] text-red-600">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="phone" className="block text-xs font-bold text-stone-700">
                      WhatsApp Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-stone-300 bg-stone-50 text-stone-600 text-xs font-bold">
                        +91
                      </span>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="98765 43210"
                        className={`w-full px-3 py-2.5 text-sm rounded-r-xl border font-sans focus:outline-none focus:ring-2 ${
                          errors.phone
                            ? "border-red-400 focus:ring-red-200"
                            : "border-stone-300 focus:ring-forest-900/20 focus:border-forest-900"
                        }`}
                      />
                    </div>
                    {errors.phone ? (
                      <p className="text-[11px] text-red-600">{errors.phone}</p>
                    ) : (
                      <p className="text-[11px] text-stone-500">
                        10-digit Indian mobile number for daily delivery updates.
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-xs font-bold text-stone-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                      <input
                        id="email"
                        type="email"
                        required
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="aditi@example.com"
                        className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border font-sans focus:outline-none focus:ring-2 ${
                          errors.email
                            ? "border-red-400 focus:ring-red-200"
                            : "border-stone-300 focus:ring-forest-900/20 focus:border-forest-900"
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-600">{errors.email}</p>}
                  </div>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                    Step 3 of 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                    Doorstep Delivery Address
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600">
                    We deliver fresh morning boxes across Bangalore residences and offices.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label htmlFor="flatNo" className="block text-xs font-bold text-stone-700">
                      Flat / Door / Apt No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="flatNo"
                      type="text"
                      required
                      value={deliveryAddress.flatNo}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, flatNo: e.target.value })}
                      placeholder="e.g. Apt 402, Block B"
                      className={`w-full px-3 py-2.5 text-sm rounded-xl border font-sans focus:outline-none focus:ring-2 ${
                        errors.flatNo
                          ? "border-red-400 focus:ring-red-200"
                          : "border-stone-300 focus:ring-forest-900/20 focus:border-forest-900"
                      }`}
                    />
                    {errors.flatNo && <p className="text-[11px] text-red-600">{errors.flatNo}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="buildingName" className="block text-xs font-bold text-stone-700">
                      Building / Society Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="buildingName"
                      type="text"
                      required
                      value={deliveryAddress.buildingName}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, buildingName: e.target.value })}
                      placeholder="e.g. Prestige Greenwoods"
                      className={`w-full px-3 py-2.5 text-sm rounded-xl border font-sans focus:outline-none focus:ring-2 ${
                        errors.buildingName
                          ? "border-red-400 focus:ring-red-200"
                          : "border-stone-300 focus:ring-forest-900/20 focus:border-forest-900"
                      }`}
                    />
                    {errors.buildingName && <p className="text-[11px] text-red-600">{errors.buildingName}</p>}
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label htmlFor="streetAddress" className="block text-xs font-bold text-stone-700">
                      Street Address / Road <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="streetAddress"
                      type="text"
                      required
                      value={deliveryAddress.streetAddress}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, streetAddress: e.target.value })}
                      placeholder="e.g. 14th Main, 5th Cross, Near Sony World Signal"
                      className={`w-full px-3 py-2.5 text-sm rounded-xl border font-sans focus:outline-none focus:ring-2 ${
                        errors.streetAddress
                          ? "border-red-400 focus:ring-red-200"
                          : "border-stone-300 focus:ring-forest-900/20 focus:border-forest-900"
                      }`}
                    />
                    {errors.streetAddress && <p className="text-[11px] text-red-600">{errors.streetAddress}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="area" className="block text-xs font-bold text-stone-700">
                      Area / Neighborhood <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="area"
                      type="text"
                      required
                      value={deliveryAddress.area}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, area: e.target.value })}
                      placeholder="e.g. Koramangala, Indiranagar, HSR"
                      className={`w-full px-3 py-2.5 text-sm rounded-xl border font-sans focus:outline-none focus:ring-2 ${
                        errors.area
                          ? "border-red-400 focus:ring-red-200"
                          : "border-stone-300 focus:ring-forest-900/20 focus:border-forest-900"
                      }`}
                    />
                    {errors.area && <p className="text-[11px] text-red-600">{errors.area}</p>}
                  </div>

                  <div className="space-y-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-stone-700">City</label>
                        <div className="px-3 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-100 text-stone-700 font-semibold flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-forest-700" />
                          <span>Bangalore</span>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="pincode" className="block text-xs font-bold text-stone-700">
                          Pincode <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="pincode"
                          type="text"
                          maxLength={6}
                          required
                          value={deliveryAddress.pincode}
                          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                          placeholder="560034"
                          className={`w-full px-3 py-2.5 text-sm rounded-xl border font-sans focus:outline-none focus:ring-2 ${
                            errors.pincode
                              ? "border-red-400 focus:ring-red-200"
                              : "border-stone-300 focus:ring-forest-900/20 focus:border-forest-900"
                          }`}
                        />
                      </div>
                    </div>
                    {errors.pincode && <p className="text-[11px] text-red-600">{errors.pincode}</p>}
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label htmlFor="deliveryNotes" className="block text-xs font-bold text-stone-700">
                      Optional Morning Delivery Notes
                    </label>
                    <input
                      id="deliveryNotes"
                      type="text"
                      value={deliveryAddress.deliveryNotes}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, deliveryNotes: e.target.value })}
                      placeholder="e.g. Leave with building security / Ring bell twice"
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-300 font-sans focus:outline-none focus:ring-2 focus:ring-forest-900/20 focus:border-forest-900"
                    />
                    <p className="text-[11px] text-stone-500">
                      Specific gate instructions or door drop preferences.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                    Step 4 of 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                    Dietary &amp; Health Preferences
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Customize your breakfast box for allergies or dietary lifestyle.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-stone-700">Dietary Style</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "standard" as DietaryType,
                        name: "Standard Mix",
                        desc: "Full wholesome variety: fruits, vegetables, sprouts, mix salad, dry fruits.",
                      },
                      {
                        id: "vegan" as DietaryType,
                        name: "100% Vegan",
                        desc: "Completely plant-derived wholesome whole foods curation.",
                      },
                      {
                        id: "pure_fruit" as DietaryType,
                        name: "Fruit Focused",
                        desc: "Enriched seasonal fruit portions with nuts and seeds.",
                      },
                    ].map((style) => (
                      <div
                        key={style.id}
                        onClick={() => setDietaryPreferences({ ...dietaryPreferences, dietaryType: style.id })}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          dietaryPreferences.dietaryType === style.id
                            ? "border-forest-900 bg-forest-50/30 shadow-sm"
                            : "border-stone-200 hover:border-stone-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-forest-900">{style.name}</span>
                          {dietaryPreferences.dietaryType === style.id && (
                            <Check className="w-3.5 h-3.5 text-forest-800" />
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 leading-snug">{style.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700">
                    Allergies or Intolerances (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_ALLERGIES.map((allergy) => {
                      const isSelected = dietaryPreferences.allergies.includes(allergy);
                      return (
                        <button
                          key={allergy}
                          type="button"
                          onClick={() => toggleAllergy(allergy)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            isSelected
                              ? "bg-forest-900 text-white border-forest-900 shadow-xs"
                              : "bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300"
                          }`}
                        >
                          {allergy} {isSelected ? "✓" : "+"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="dietNotes" className="block text-xs font-bold text-stone-700">
                    Additional Dietary Notes
                  </label>
                  <textarea
                    id="dietNotes"
                    rows={3}
                    value={dietaryPreferences.notes}
                    onChange={(e) => setDietaryPreferences({ ...dietaryPreferences, notes: e.target.value })}
                    placeholder="e.g. Please no spicy dressings, low sodium salad, prefer soft fruits"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-300 font-sans focus:outline-none focus:ring-2 focus:ring-forest-900/20 focus:border-forest-900"
                  />
                </div>
              </div>
            )}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                    Step 5 of 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                    Review Your Subscription
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Confirm your details. Once submitted, our coordinator will connect via WhatsApp to schedule your deliveries.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-forest-50/50 border border-forest-900/20 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-forest-900/10">
                    <div>
                      <span className="font-extrabold text-base text-forest-900">
                        {activePlan.name} Plan (Monthly)
                      </span>
                      <span className="text-xs text-stone-500 block">
                        5 daily compartments · Bangalore Doorstep Delivery
                      </span>
                    </div>
                    <span className="font-mono text-xl font-extrabold text-forest-900">
                      ₹{activePlan.monthlyPriceINR}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Monthly Subscription Fee:</span>
                      <span className="font-bold text-stone-800">₹{activePlan.monthlyPriceINR}</span>
                    </div>
                    <div className="flex justify-between text-forest-800">
                      <span>Morning Delivery Fee:</span>
                      <span className="font-bold">FREE (Complimentary)</span>
                    </div>
                    <div className="flex justify-between text-teal-800">
                      <span>MedCity Smiles Membership &amp; Monthly Health Checkup:</span>
                      <span className="font-bold">Included Free</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-forest-900/10 text-sm font-extrabold text-forest-950">
                      <span>Total Amount to Confirm:</span>
                      <span className="font-mono text-base">₹{activePlan.monthlyPriceINR} / month</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase text-stone-500">Contact</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-[11px] font-semibold text-forest-800 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="font-bold text-stone-900 truncate">{customer.fullName || "—"}</p>
                    <p className="text-stone-600">{customer.phone || "—"}</p>
                    <p className="text-stone-500 truncate">{customer.email || "—"}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase text-stone-500">Delivery</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="text-[11px] font-semibold text-forest-800 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="font-bold text-stone-900 truncate">
                      {deliveryAddress.buildingName || "—"}
                    </p>
                    <p className="text-stone-600 line-clamp-2">
                      {deliveryAddress.flatNo}, {deliveryAddress.streetAddress}, {deliveryAddress.area}, Bangalore - {deliveryAddress.pincode}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase text-stone-500">Diet Style</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="text-[11px] font-semibold text-forest-800 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="font-bold text-stone-900 capitalize">
                      {dietaryPreferences.dietaryType.replace("_", " ")}
                    </p>
                    <p className="text-stone-600 line-clamp-2">
                      Allergies: {dietaryPreferences.allergies.length ? dietaryPreferences.allergies.join(", ") : "None reported"}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block">Assisted Doorstep Registration (Mode B)</span>
                    <p className="text-amber-800 leading-relaxed">
                      No card charge today. Upon submission, you will receive a reference tracking code and a one-click WhatsApp link to coordinate delivery start date with our team at Berrybeats cafe.
                    </p>
                  </div>
                </div>

                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block">Submission Error:</strong>
                      <span>{submitError}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center pt-8 border-t border-stone-100 mt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <Link
                  href="/"
                  className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
                >
                  ← Cancel &amp; Return
                </Link>
              )}

              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  brand="humming"
                  variant="primary"
                  size="md"
                  className="rounded-full px-6"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isPending}
                  isLoading={isPending}
                  brand="humming"
                  variant="primary"
                  size="lg"
                  className="rounded-full px-8 bg-forest-900 hover:bg-forest-800 shadow-md"
                >
                  <span>Submit Registration &amp; Connect on WhatsApp</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
