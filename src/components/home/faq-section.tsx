"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does morning doorstep delivery work?",
    answer:
      "We prepare your whole foods fresh at dawn at Berrybeats Cafe, pack them into sealed, temperature-maintained boxes, and deliver them directly to your doorstep across Bangalore every morning before breakfast. You receive fresh nutrition with zero kitchen prep.",
  },
  {
    question: "Can I customise my box or dietary preferences?",
    answer:
      "Yes! Both our Standard (₹3,500/mo) and Premium (₹4,000/mo) plans can be customized based on personal allergies, fruit preferences, or diabetic-friendly choices. Simply contact us after subscribing, or call our team directly at 8618902810.",
  },
  {
    question: "What is included in the free monthly health check?",
    answer:
      "Every subscriber receives a complimentary monthly vital checkup in partnership with MedCity Health Labs, covering Blood Sugar, Cholesterol, and Blood Pressure. This allows you to track your body's wellness progress over time alongside wholesome nutrition.",
  },
  {
    question: "How do I pause or cancel my subscription?",
    answer:
      "You have complete flexibility. If you are traveling or need a break, you can pause or resume deliveries anytime with a 24-hour notice via WhatsApp (8618902810) or through your subscriber account. Paused days are carried forward so you never lose value.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="py-14 sm:py-16 lg:py-24 bg-canvas border-b border-[#E2ECE4] relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[20px] bg-white border border-[#E2ECE4] text-primary text-xs font-semibold shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span>Got Questions?</span>
          </div>

          <h2 className="font-display text-[1.75rem] sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight leading-[1.18]">
            Frequently Asked Questions
          </h2>

          <p className="text-base sm:text-lg text-body font-sans leading-relaxed">
            Everything you need to know about our morning box deliveries, health checks, and plans.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-[20px] bg-white border border-[#E2ECE4] overflow-hidden shadow-2xs transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  className="w-full min-h-[48px] py-4 sm:py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-ink hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-mint flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-primary text-white" : "text-body"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.25,
                        ease: "easeOut",
                      }}
                    >
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-sm text-body leading-relaxed border-t border-[#E2ECE4]/60">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
