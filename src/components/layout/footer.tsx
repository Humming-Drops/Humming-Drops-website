import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { SHARED_FOOTER_CONFIG } from "@/types/navigation";

export function Footer() {
  return (
    <footer className="border-t border-line-subtle bg-muted/50 transition-brand mt-auto">
      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-44">
                <Image
                  src="/images/humming-drops-logo.png"
                  alt="Humming Drops Official Logo"
                  fill
                  sizes="176px"
                  className="object-contain object-left"
                />
              </div>
            </div>

            <p className="text-sm text-content-secondary max-w-sm leading-relaxed">
              Healthy, fresh breakfast boxes delivered to your doorsteps. In partnership with Berrybeats Cafe and MedCity Health Labs.
            </p>

            <div className="pt-2 text-xs text-content-muted border-t border-line-subtle/60">
              <p>{SHARED_FOOTER_CONFIG.partners}</p>
            </div>
          </div>

          {/* Link Groups (3 Columns) */}
          {SHARED_FOOTER_CONFIG.linkGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="font-display font-bold text-sm text-content-primary tracking-tight">
                {group.title}
              </h3>
              <ul className="space-y-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-content-secondary hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
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
        <div className="mt-12 pt-8 border-t border-line-subtle">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm text-content-secondary">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href={`tel:${SHARED_FOOTER_CONFIG.phone}`}
                className="flex items-center gap-2 hover:text-brand-primary font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
              >
                <Phone className="w-4 h-4 text-brand-primary" aria-hidden="true" />
                <span>+91 {SHARED_FOOTER_CONFIG.phone}</span>
              </a>

              <a
                href={`mailto:${SHARED_FOOTER_CONFIG.email}`}
                className="flex items-center gap-2 hover:text-brand-primary font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
              >
                <Mail className="w-4 h-4 text-brand-primary" aria-hidden="true" />
                <span>{SHARED_FOOTER_CONFIG.email}</span>
              </a>

              <div className="flex items-center gap-2 text-content-muted">
                <MapPin className="w-4 h-4 text-content-muted" aria-hidden="true" />
                <span>{SHARED_FOOTER_CONFIG.location}</span>
              </div>
            </div>

            <div className="text-xs text-content-muted">
              Humming Drops · MedCity Smiles
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-line-subtle bg-canvas py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-content-muted">
            <p>
              © {new Date().getFullYear()} Humming Drops. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/about" className="hover:text-brand-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-brand-primary transition-colors">
                Contact
              </Link>
              <Link href="/plans" className="hover:text-brand-primary transition-colors">
                Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
