import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { AuthCard, AuthHeader, AuthShell } from "@/components/auth/auth-shell";
import { OnboardingForm } from "./onboarding-form";

// Reads the signed-in user's own account state; never prerendered --
// see src/app/admin/layout.tsx for the same reasoning.
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const current = await getCurrentUser();
  if (!current) {
    redirect("/login?session=expired");
  }

  // Intentional: sign-up creates the profile, so /onboarding is only for accounts that have none
  // (e.g. created outside the sign-up form). Everyone else goes straight to the dashboard.
  if (current.profile) {
    redirect("/dashboard/overview");
  }

  return (
    <AuthShell>
      <AuthCard>
        <AuthHeader
          title="Welcome to Humming Drops"
          description="Tell us your name and mobile number so we can set up your account."
        />
        <OnboardingForm defaultEmail={current.user.email} />
      </AuthCard>
    </AuthShell>
  );
}
