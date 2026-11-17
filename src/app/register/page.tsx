import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { AuthShell, CLERK_AUTH_APPEARANCE } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Register for Humming Drops & MedCity Smiles.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      badgeText="Start Your Morning Habit"
      title="Join Humming Drops"
      subtitle="Create your account to customize your breakfast box and unlock free MedCity Smiles perks."
    >
      <SignUp
        path="/register"
        routing="path"
        signInUrl="/login"
        fallbackRedirectUrl="/subscribe"
        signInFallbackRedirectUrl="/dashboard/overview"
        appearance={CLERK_AUTH_APPEARANCE}
      />
    </AuthShell>
  );
}
