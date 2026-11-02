export type PillarStatus = "authoritative" | "provisional_client_copy_pending";

export interface HolisticPillar {
  id: string;
  pillarNumber: number;
  label: string;
  title: string;
  shortCopy: string;
  brochureSource: string;
  status: PillarStatus;
  badgeBg: string;
  badgeColor: string;
  borderClass: string;
}

/**
 * The 4 Holistic Health Pillars from Brochure Page 6.
 *
 * ARCHITECTURAL NOTICE (HUM-13 / HUM-W1-03):
 * - Pillars 1 & 2 ("Fuel Your Brain" & "Protect Your Vitals") are AUTHORITATIVE, directly
 *   mapped to Humming Drops daily nutrition and MedCity Health Labs free monthly vitals.
 * - Pillars 3 & 4 ("Cultivate Positive Self-Talk" & "Happy-Healthy Coping") are PROVISIONAL
 *   brochure placeholders. Per governance rules, replacement occurs ONLY upon client copy receipt.
 */
export const HOLISTIC_PILLARS: HolisticPillar[] = [
  {
    id: "mind",
    pillarNumber: 1,
    label: "MIND",
    title: "Fuel Your Brain",
    shortCopy: "A balanced whole-food diet supports brain health and stable mood — powered by your daily Humming Drops morning box.",
    brochureSource: "Brochure Page 6, Item 1",
    status: "authoritative",
    badgeBg: "bg-teal-100",
    badgeColor: "text-teal-800",
    borderClass: "border-teal-200",
  },
  {
    id: "body",
    pillarNumber: 2,
    label: "BODY",
    title: "Protect Your Vitals",
    shortCopy: "Free monthly health checkups for Blood Sugar, Cholesterol, and Blood Pressure in collaboration with MedCity Health Labs.",
    brochureSource: "Brochure Page 6, Item 2",
    status: "authoritative",
    badgeBg: "bg-emerald-100",
    badgeColor: "text-emerald-800",
    borderClass: "border-emerald-200",
  },
  {
    id: "self_talk",
    pillarNumber: 3,
    label: "MINDSET",
    title: "Cultivate Positive Self-Talk",
    shortCopy: "Challenge negative thoughts, replace with realistic affirmations, and celebrate small achievements every day.",
    brochureSource: "Brochure Page 6, Item 3 (Provisional: awaiting client copy receipt)",
    status: "provisional_client_copy_pending",
    badgeBg: "bg-teal-100",
    badgeColor: "text-teal-800",
    borderClass: "border-teal-200",
  },
  {
    id: "coping",
    pillarNumber: 4,
    label: "COMMUNITY",
    title: "Happy-Healthy Coping",
    shortCopy: "Supportive network with doctor & clinical nutritionist advisory, mindful movement, creative outlets, and joyful community sessions.",
    brochureSource: "Brochure Page 6, Item 4 (Provisional: awaiting client copy receipt)",
    status: "provisional_client_copy_pending",
    badgeBg: "bg-amber-100",
    badgeColor: "text-amber-800",
    borderClass: "border-amber-200",
  },
];
