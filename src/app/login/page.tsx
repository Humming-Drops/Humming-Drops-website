import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Humming Drops subscriber account.",
};

export default function LoginPage() {
  return (
    <div className="flex justify-center px-4 py-16">
      <SignIn path="/login" routing="path" signUpUrl="/register" fallbackRedirectUrl="/dashboard/overview" />
    </div>
  );
}
