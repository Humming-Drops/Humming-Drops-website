import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Register for Humming Drops & MedCity Smiles.",
};

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-stone-900">Create Your Account</h1>
        <p className="text-xs text-stone-500">To start your fresh breakfast box subscription, select a plan first.</p>
      </div>

      <div className="p-6 rounded-2xl border border-stone-200 bg-white space-y-4 shadow-sm text-center">
        <p className="text-sm text-stone-600">
          Account registration is integrated directly into our 5-step subscription flow.
        </p>
        <Link
          href="/subscribe"
          className="inline-block w-full py-2.5 rounded-full bg-forest-900 text-white font-semibold text-sm hover:bg-forest-800 transition"
        >
          Choose Plan &amp; Register →
        </Link>
      </div>

      <div className="text-center text-xs text-stone-500">
        Already subscribed?{" "}
        <Link href="/login" className="text-forest-800 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
