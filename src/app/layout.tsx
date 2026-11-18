import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { BrandThemeProvider } from "@/components/theme/brand-provider";
import { AuthProvider } from "@/lib/auth/client";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFEF8",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hummingdrops.com"),
  title: {
    template: "%s | Humming Drops",
    default: "Humming Drops | Healthy Drops, Healthier you",
  },
  description:
    "Healthy, fresh breakfast boxes delivered to your doorstep. Supporting daily nutrition and mental wellbeing in partnership with Berrybeats Cafe and MedCity Health Labs.",
  keywords: [
    "Humming Drops",
    "Breakfast Subscription Bangalore",
    "Fresh Fruit Box",
    "MedCity Smiles",
    "Healthy Morning Breakfast",
    "Berrybeats Cafe",
  ],
  authors: [{ name: "Humming Drops" }],
  openGraph: {
    siteName: "Humming Drops",
    type: "website",
    locale: "en_IN",
    images: ["/images/humming-drops-box.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="humming" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-canvas text-content-primary antialiased transition-brand">
        <AuthProvider>
          <BrandThemeProvider>
            <AppShell>{children}</AppShell>
          </BrandThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
