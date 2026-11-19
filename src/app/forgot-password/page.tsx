import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/password-reset-forms";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Humming Drops account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FDFCF7] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white border border-[#E2ECE4] rounded-3xl p-6 sm:p-8 shadow-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
