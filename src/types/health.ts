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
    purpose: "Free monthly checkup included with your subscription, in collaboration with MedCity Health Labs.",
    frequency: "Monthly",
    partnerLab: "MedCity Health Labs",
  },
  {
    metricName: "Cholesterol",
    purpose: "Free monthly checkup included with your subscription, in collaboration with MedCity Health Labs.",
    frequency: "Monthly",
    partnerLab: "MedCity Health Labs",
  },
  {
    metricName: "Blood Pressure",
    purpose: "Free monthly checkup included with your subscription, in collaboration with MedCity Health Labs.",
    frequency: "Monthly",
    partnerLab: "MedCity Health Labs",
  },
];
