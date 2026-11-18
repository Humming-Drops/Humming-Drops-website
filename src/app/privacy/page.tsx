import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/layout/legal-placeholder";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Humming Drops handles subscriber information.",
};

export default function PrivacyPage() {
  return (
    <LegalPlaceholder
      title="Privacy Policy"
      topics={[
        "What personal information is collected (contact, address, dietary preferences)",
        "How health information from the MedCity Smiles program is collected, stored and protected",
        "Who the information is shared with, including partner organisations",
        "Retention, access and deletion requests",
      ]}
    />
  );
}
