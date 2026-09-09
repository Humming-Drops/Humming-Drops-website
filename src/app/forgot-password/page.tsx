import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover your Humming Drops account access.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-stone-900">Reset Password</h1>
        <p className="text-xs text-stone-500">Enter your registered email address to receive recovery instructions.</p>
      </div>

      <div className="p-6 rounded-2xl border border-stone-200 bg-white space-y-4 shadow-sm">
        <div className="space-y-1 text-xs text-stone-600">
          <label className="font-semibold text-stone-700">Email Address</label>
          <input
            type="email"
            placeholder="name@example.com"
            disabled
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-stone-50 text-stone-400 cursor-not-allowed"
          />
        </div>

        <button
          type="button"
          disabled
          className="w-full py-2.5 rounded-full bg-forest-900/50 text-white font-semibold text-sm cursor-not-allowed"
        >
          Send Reset Link (Phase 7)
        </button>
      </div>

      <div className="text-center text-xs text-stone-500">
        Remember your password?{" "}
        <Link href="/login" className="text-forest-800 font-semibold hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
