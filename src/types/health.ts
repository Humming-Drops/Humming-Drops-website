/**
 * Health Vitals Domain Types
 *
 * STRICT SECURITY GUARDRAIL:
 * Health vitals represent sensitive personal health information.
 * - This data MUST strictly be scoped to the authenticated owner (userId).
 * - NEVER expose health vitals via public APIs, public query endpoints, or client bundles.
 * - Confined strictly to the confirmed brochure scope: Free Monthly Checkup (Sugar, Cholesterol, BP).
 */

export interface HealthVitalsRecord {
  id: string;
  userId: string; // Strictly scoped to authenticated user
  checkupDate: string;
  bloodSugarFastingMgDl?: number;
  bloodSugarPostPrandialMgDl?: number;
  cholesterolTotalMgDl?: number;
  bloodPressureSystolicMmHg?: number;
  bloodPressureDiastolicMmHg?: number;
  doctorNotes?: string;
  reportPdfUrl?: string; // Stored in private, authenticated Supabase Storage bucket
  createdAt: string;
}

export interface VitalsSummaryItem {
  metricName: "Blood Sugar" | "Cholesterol" | "Blood Pressure";
  purpose: string;
  frequency: "Monthly";
  partnerLab: "MedCity Health Labs";
}

export const CONFIRMED_VITALS_BENEFITS: VitalsSummaryItem[] = [
  {
    metricName: "Blood Sugar",
    purpose: "A free blood sugar reading every month with MedCity Health Labs, so you can see how it changes over time.",
    frequency: "Monthly",
    partnerLab: "MedCity Health Labs",
  },
  {
    metricName: "Cholesterol",
    purpose: "A free cholesterol check every month with MedCity Health Labs, reviewed by our community of doctors and clinical nutritionists.",
    frequency: "Monthly",
    partnerLab: "MedCity Health Labs",
  },
  {
    metricName: "Blood Pressure",
    purpose: "A free blood pressure reading every month with MedCity Health Labs, with advice from our doctors and nutritionists.",
    frequency: "Monthly",
    partnerLab: "MedCity Health Labs",
  },
];
