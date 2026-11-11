import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles, users } from "@/lib/db/schema";
import { OnboardingForm } from "./onboarding-form";

// Reads the signed-in user's own account state; never prerendered --
// see src/app/admin/layout.tsx for the same reasoning.
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    redirect("/login");
  }

  const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1);
  if (!user) {
    redirect("/login");
  }

  const [existingProfile] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  if (existingProfile) {
    redirect("/dashboard/overview");
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
            One last step
          </p>
          <h1 className="font-display text-2xl font-extrabold text-content-primary">
            Welcome to Humming Drops
          </h1>
          <p className="text-sm text-content-secondary">
            Tell us your name and mobile number so we can set up your account.
          </p>
        </div>
        <OnboardingForm defaultEmail={user.email} />
      </div>
    </div>
  );
}
