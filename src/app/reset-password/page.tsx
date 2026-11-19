import type { Metadata } from "next";
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
    <div className="min-h-[calc(100vh-4rem)] bg-[#FDFCF7] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white border border-[#E2ECE4] rounded-3xl p-6 sm:p-8 shadow-sm">
        <ResetPasswordForm token={typeof token === "string" ? token : ""} />
      </div>
    </div>
  );
}
