import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { AuthShell, CLERK_AUTH_APPEARANCE } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Humming Drops subscriber account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      badgeText="Subscriber Portal"
      title="Welcome back"
      subtitle="Access your morning delivery schedule, dietary notes, and monthly health vitals."
    >
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/register"
        fallbackRedirectUrl="/dashboard/overview"
        signUpFallbackRedirectUrl="/subscribe"
        appearance={CLERK_AUTH_APPEARANCE}
      />
    </AuthShell>
  );
}
