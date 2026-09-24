import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { SHARED_FOOTER_CONFIG } from "@/types/navigation";

export function Footer() {
  return (
    <footer className="border-t border-line-subtle bg-muted/50 transition-brand mt-auto">
      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-6 lg:gap-x-10">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-3">
            <div className="relative h-9 w-36">
              <Image
                src="/images/humming-drops-logo.png"
                alt="Humming Drops Official Logo"
                fill
                sizes="144px"
                className="object-contain object-left"
              />
            </div>

            <p className="text-sm text-content-secondary max-w-sm leading-relaxed">
              Healthy, fresh breakfast boxes delivered to your doorsteps.
            </p>
            <p className="text-xs text-content-muted">{SHARED_FOOTER_CONFIG.partners}</p>
          </div>

          {/* Link Groups */}
          {SHARED_FOOTER_CONFIG.linkGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h3 className="font-display font-bold text-sm text-content-primary tracking-tight">
                {group.title}
              </h3>
              <ul className="space-y-1.5 text-sm">
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
        <div className="mt-6 pt-5 border-t border-line-subtle">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-content-secondary">
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
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-line-subtle bg-canvas py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-content-muted">
            © {new Date().getFullYear()} Humming Drops · MedCity Smiles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
