import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { SHARED_FOOTER_CONFIG } from "@/types/navigation";

export function Footer() {
  return (
    <footer className="border-t border-[#E2ECE4] bg-mint/40 transition-colors mt-auto">
      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-44">
                <Image
                  src="/images/humming-drops-logo.png"
                  alt="Humming Drops Official Logo"
                  fill
                  sizes="176px"
                  className="object-contain object-left"
                />
              </div>
            </div>

            <p className="text-sm text-body max-w-sm leading-relaxed font-sans">
              Daily doorstep morning breakfast boxes of fresh cut fruits, vegetables, mix salad, sprouts, and dry fruits in Bangalore.
            </p>

            <div className="pt-2 text-xs text-body/80 border-t border-[#E2ECE4]">
              <p className="font-medium text-ink">{SHARED_FOOTER_CONFIG.partners}</p>
            </div>
          </div>

          {/* Link Groups (Stacked on Mobile) */}
          {SHARED_FOOTER_CONFIG.linkGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="font-display font-bold text-sm text-ink tracking-tight">
                {group.title}
              </h3>
              <ul className="space-y-2 text-sm font-sans">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded inline-flex items-center min-h-[36px] py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Strip */}
        <div className="mt-10 pt-6 border-t border-[#E2ECE4]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs sm:text-sm text-body font-sans">
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-6 w-full lg:w-auto">
              <a
                href={`tel:${SHARED_FOOTER_CONFIG.phone}`}
                className="flex items-center gap-2.5 hover:text-primary font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded min-h-[48px] py-1"
              >
                <Phone className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span>+91 {SHARED_FOOTER_CONFIG.phone}</span>
              </a>

              <a
                href={`https://wa.me/91${SHARED_FOOTER_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-primary font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded min-h-[48px] py-1"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" aria-hidden="true" />
                <span>WhatsApp: {SHARED_FOOTER_CONFIG.whatsapp}</span>
              </a>

              <a
                href={`mailto:${SHARED_FOOTER_CONFIG.email}`}
                className="flex items-center gap-2.5 hover:text-primary font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded min-h-[48px] py-1"
              >
                <Mail className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span>{SHARED_FOOTER_CONFIG.email}</span>
              </a>

              <a
                href="https://maps.google.com/?q=Berrybeats+Cafe+Bangalore"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-body hover:text-primary min-h-[48px] py-1"
              >
                <MapPin className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span>{SHARED_FOOTER_CONFIG.location}</span>
              </a>
            </div>

            <div className="text-xs text-body font-medium pt-2 lg:pt-0">
              Humming Drops · MedCity Smiles
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-[#E2ECE4] bg-white py-5">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-body font-sans text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} Humming Drops. All rights reserved. · Bangalore Doorstep Nutrition
            </p>
            <div className="flex flex-wrap justify-center gap-4 font-medium">
              <Link href="/about" className="hover:text-primary transition-colors min-h-[36px] inline-flex items-center">
                About
              </Link>
              <Link href="/medcity-smiles" className="text-teal-700 hover:text-teal-800 font-bold transition-colors min-h-[36px] inline-flex items-center">
                MedCity Smiles
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors min-h-[36px] inline-flex items-center">
                Contact
              </Link>
              <Link href="/subscribe?plan=standard" className="hover:text-primary transition-colors min-h-[36px] inline-flex items-center">
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
