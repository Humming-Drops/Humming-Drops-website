import type { Metadata } from "next";
import { AuthCard, AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/password-reset-forms";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Choose a new password for your Humming Drops account.",
  robots: { index: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token } = await searchParams;
  return (
    <AuthShell>
      <AuthCard>
        <ResetPasswordForm token={typeof token === "string" ? token : ""} />
      </AuthCard>
    </AuthShell>
  );
}
