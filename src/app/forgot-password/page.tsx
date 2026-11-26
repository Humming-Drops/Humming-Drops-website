import type { Metadata } from "next";
import { AuthCard, AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/password-reset-forms";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Humming Drops account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <AuthCard>
        <ForgotPasswordForm />
      </AuthCard>
    </AuthShell>
  );
}
