import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover your Humming Drops account access.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-canvas flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-content-secondary">
            Account sign-in and password recovery are securely managed through Clerk on our sign-in screen.
          </p>
        </div>

        <Card className="p-6 sm:p-7 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="resetEmail" className="block text-xs font-bold text-content-secondary">
              Registered Email Address
            </label>
            <input
              id="resetEmail"
              type="email"
              placeholder="name@example.com"
              disabled
              className="w-full px-3.5 py-2.5 border border-line-subtle rounded-xl text-sm bg-muted/40 text-content-muted cursor-not-allowed"
            />
          </div>

          <Button variant="primary" size="md" asChild className="w-full justify-center">
            <Link href="/login">Continue to Sign-In Recovery</Link>
          </Button>
        </Card>

        <div className="text-center text-xs text-content-secondary">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-brand-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
