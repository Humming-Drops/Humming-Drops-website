import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { SHARED_FOOTER_CONFIG } from "@/types/navigation";

export function Footer() {
  return (
    <footer className="border-t border-line-subtle bg-muted/40 transition-brand mt-auto">
      {/* Compact Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Brand & Direct Contact Column */}
          <div className="col-span-2 space-y-2.5">
            <div className="relative h-8 w-32">
              <Image
                src="/images/humming-drops-logo.png"
                alt="Humming Drops Official Logo"
                fill
                sizes="128px"
                className="object-contain object-left"
              />
            </div>

            <p className="text-xs sm:text-sm text-content-secondary max-w-sm leading-relaxed">
              Healthy, fresh breakfast boxes delivered to Bangalore doorsteps.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-content-secondary">
              <a
                href={`tel:${SHARED_FOOTER_CONFIG.phone}`}
                className="inline-flex items-center gap-1.5 hover:text-brand-primary font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
              >
                <Phone className="w-3.5 h-3.5 text-brand-primary" aria-hidden="true" />
                <span>+91 {SHARED_FOOTER_CONFIG.phone}</span>
              </a>

              <a
                href={`mailto:${SHARED_FOOTER_CONFIG.email}`}
                className="inline-flex items-center gap-1.5 hover:text-brand-primary font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
              >
                <Mail className="w-3.5 h-3.5 text-brand-primary" aria-hidden="true" />
                <span>{SHARED_FOOTER_CONFIG.email}</span>
              </a>
            </div>

            <p className="text-[11px] text-content-muted">
              {SHARED_FOOTER_CONFIG.partners}
            </p>
          </div>

          {/* Link Groups */}
          {SHARED_FOOTER_CONFIG.linkGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-content-primary">
                {group.title}
              </h3>
              <ul className="space-y-1 text-xs">
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
      </div>

      {/* Bottom Compact Bar */}
      <div className="border-t border-line-subtle bg-canvas/80 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-content-muted">
          <p>© {new Date().getFullYear()} Humming Drops · MedCity Smiles. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-content-muted shrink-0" aria-hidden="true" />
            <span>{SHARED_FOOTER_CONFIG.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
