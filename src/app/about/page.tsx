import type { Metadata } from "next";
import Link from "next/link";
import { OFFICIAL_CONTACT } from "@/lib/checkout-config";

export const metadata: Metadata = {
  title: "About Us | Our Story & Kitchen",
  description:
    "Learn about Humming Drops, our mission to nourish the body, and our kitchen base at Berrybeats Cafe, Bangalore.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="space-y-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-forest-700 bg-forest-50 px-3 py-1 rounded-full">
          About Humming Drops
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
          Nourishing the Body. Uplifting the Mind. Building a Happier Community.
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          Humming Drops was founded on the simple belief that achieving optimal health shouldn&apos;t be a struggle. We are dedicated to delivering essential daily nutrition right to your doorstep, making wellness effortless and enjoyable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
          <h2 className="text-xl font-bold text-forest-900">The Problem We Are Solving</h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            In today&apos;s fast-paced world, finding the time to consistently add the right nutrients and vitamins to your diet is a common challenge. Many people miss out on the vital goodness of fresh fruits and vegetables, impacting both their physical and mental energy.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
          <h2 className="text-xl font-bold text-forest-900">Our Solution</h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Humming Drops solves this by offering a convenient, monthly subscription service for fresh mixed cut fruit boxes, delivered every morning. We ensure you receive the natural vitamins and nourishment you need through meticulously prepared, high-quality produce.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-forest-900 text-white space-y-4">
        <h2 className="text-2xl font-bold">Kitchen Base &amp; Partnerships</h2>
        <p className="text-sm text-forest-100 max-w-2xl leading-relaxed">
          Our fresh fruit and vegetable boxes are prepared fresh every morning in Bangalore at our operational base, <strong>{OFFICIAL_CONTACT.kitchenLocation}</strong>. In collaboration with <strong>{OFFICIAL_CONTACT.partners.medCityLabs}</strong>, we integrate free monthly health vitals checkups and mental wellbeing support into every box.
        </p>
        <div className="pt-2">
          <Link
            href="/subscribe"
            className="inline-block px-6 py-2.5 rounded-full bg-white text-forest-900 font-semibold hover:bg-forest-50 transition text-sm"
          >
            Start Your Monthly Subscription →
          </Link>
        </div>
      </div>
    </div>
  );
}
