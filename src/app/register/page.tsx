import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Register for Humming Drops & MedCity Smiles.",
};

export default function RegisterPage() {
  return (
    <div className="flex justify-center px-4 py-16">
      <SignUp
        path="/register"
        routing="path"
        signInUrl="/login"
        fallbackRedirectUrl="/subscribe"
        signInFallbackRedirectUrl="/dashboard/overview"
      />
    </div>
  );
}
