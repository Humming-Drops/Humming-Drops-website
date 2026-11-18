import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/layout/legal-placeholder";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Humming Drops subscribers.",
};

export default function TermsPage() {
  return (
    <LegalPlaceholder
      title="Terms of Service"
      topics={[
        "Subscription plans, pricing and billing",
        "Delivery, pausing and cancellation (CLIENT INPUT REQUIRED)",
        "Subscription confirmation process",
        "MedCity Smiles community membership and health program participation",
        "Limitation of liability",
      ]}
    />
  );
}
