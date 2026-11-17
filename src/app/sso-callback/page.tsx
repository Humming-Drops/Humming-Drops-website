"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-800 mb-4 shadow-2xs">
        <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
      </div>
      <h2 className="font-display text-xl font-bold text-forest-950">
        Completing authentication...
      </h2>
      <p className="mt-1 text-xs text-stone-500">
        Securing your session with Humming Drops. Please wait a moment.
      </p>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
