import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Subscriber Login",
  description: "Sign in to your Humming Drops subscriber portal.",
};

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-stone-900">Subscriber Sign In</h1>
        <p className="text-xs text-stone-500">Manage your morning box delivery, pause dates, and health vitals.</p>
      </div>

      <div className="p-6 rounded-2xl border border-stone-200 bg-white space-y-4 shadow-sm">
        <div className="space-y-1 text-xs text-stone-600">
          <label className="font-semibold text-stone-700">Mobile Number or Email</label>
          <input
            type="text"
            placeholder="e.g. 9876543210 or name@example.com"
            disabled
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-stone-50 text-stone-400 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1 text-xs text-stone-600">
          <div className="flex justify-between">
            <label className="font-semibold text-stone-700">Password</label>
            <Link href="/forgot-password" className="text-forest-700 hover:underline">Forgot?</Link>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            disabled
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-stone-50 text-stone-400 cursor-not-allowed"
          />
        </div>

        <button
          type="button"
          disabled
          className="w-full py-2.5 rounded-full bg-forest-900/50 text-white font-semibold text-sm cursor-not-allowed"
        >
          Sign In (Authentication in Phase 7)
        </button>
      </div>

      <div className="text-center text-xs text-stone-500">
        Don&apos;t have an account yet?{" "}
        <Link href="/subscribe" className="text-forest-800 font-semibold hover:underline">
          Subscribe to a Plan
        </Link>
      </div>
    </div>
  );
}
