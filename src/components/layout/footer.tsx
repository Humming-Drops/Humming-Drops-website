import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { SHARED_FOOTER_CONFIG } from "@/types/navigation";

export function Footer() {
  return (
    <footer className="border-t border-line-subtle bg-brand-subtle/35 transition-colors mt-auto">
      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-10">
          {/* Brand Block */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="relative h-9 w-36 block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                aria-label="Humming Drops Home"
              >
                <Image
                  src="/images/humming-drops-logo.png"
                  alt="Humming Drops Official Logo"
                  fill
                  sizes="176px"
                  className="object-contain object-left"
                />
              </Link>
            </div>

            <p className="text-sm text-content-secondary max-w-sm leading-relaxed font-sans">
              Doorstep morning breakfast boxes in Bangalore — a fresh fruit &amp; vegetable box 4 days a week, plus a healthy oats meal 2 days a week.
            </p>

            <div className="pt-2.5 text-xs border-t border-line-subtle max-w-sm">
              <p className="font-medium text-content-primary">{SHARED_FOOTER_CONFIG.partners}</p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-content-muted font-display">
              Explore
            </h2>
            <nav aria-label="Footer Navigation" className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 text-sm font-sans">
              <Link
                href="/plans"
                className="text-content-secondary hover:text-brand-primary transition-colors min-h-[36px] inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Subscription Plans
              </Link>
              <Link
                href="/#journey"
                className="text-content-secondary hover:text-brand-primary transition-colors min-h-[36px] inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                How It Works
              </Link>
              <Link
                href="/medcity-smiles"
                className="text-content-secondary hover:text-brand-primary transition-colors min-h-[36px] inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                MedCity Smiles
              </Link>
              <Link
                href="/about"
                className="text-content-secondary hover:text-brand-primary transition-colors min-h-[36px] inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-content-secondary hover:text-brand-primary transition-colors min-h-[36px] inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Contact Support
              </Link>
            </nav>
          </div>

          {/* Contact & Kitchen Hub */}
          <div className="md:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-content-muted font-display">
              Connect &amp; Kitchen Hub
            </h2>
            <div className="flex flex-col gap-1 text-sm text-content-secondary font-sans">
              <a
                href={`tel:${SHARED_FOOTER_CONFIG.phone}`}
                className="flex items-center gap-2.5 hover:text-brand-primary font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-brand-primary shrink-0" aria-hidden="true" />
                <span>+91 {SHARED_FOOTER_CONFIG.phone}</span>
              </a>

              <a
                href={`https://wa.me/91${SHARED_FOOTER_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-brand-primary font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" aria-hidden="true" />
                <span>WhatsApp: {SHARED_FOOTER_CONFIG.whatsapp}</span>
              </a>

              <a
                href={`mailto:${SHARED_FOOTER_CONFIG.email}`}
                className="flex items-center gap-2.5 hover:text-brand-primary font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded min-h-[44px]"
              >
                <Mail className="w-4 h-4 text-brand-primary shrink-0" aria-hidden="true" />
                <span>{SHARED_FOOTER_CONFIG.email}</span>
              </a>

              <a
                href="https://maps.google.com/?q=Berrybeats+Cafe+Bangalore"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded min-h-[44px]"
              >
                <MapPin className="w-4 h-4 text-brand-primary shrink-0" aria-hidden="true" />
                <span>{SHARED_FOOTER_CONFIG.location}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-line-subtle bg-surface py-4">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-content-secondary font-sans text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} Humming Drops. All rights reserved. · Bangalore Doorstep Nutrition
            </p>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 font-medium">
              <Link
                href="/about"
                className="hover:text-brand-primary hover:underline transition-colors min-h-[36px] inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                About
              </Link>
              <Link
                href="/medcity-smiles"
                className="hover:text-brand-primary hover:underline transition-colors min-h-[36px] inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                MedCity Smiles
              </Link>
              <Link
                href="/contact"
                className="hover:text-brand-primary hover:underline transition-colors min-h-[36px] inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Contact
              </Link>
              <Link
                href="/subscribe?plan=standard"
                className="hover:text-brand-primary hover:underline transition-colors min-h-[36px] inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
