import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { BrandThemeProvider } from "@/components/theme/brand-provider";
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

export const metadata: Metadata = {
  title: {
    template: "%s | Humming Drops",
    default: "Humming Drops | Healthy Drops, Healthier you",
  },
  description:
    "Fresh mixed cut fruit & breakfast boxes delivered every morning to your doorstep in Bangalore. Complete physical and mental wellness ecosystem in partnership with MedCity Smiles and MedCity Health Labs.",
  keywords: [
    "Humming Drops",
    "Breakfast Subscription Bangalore",
    "Fresh Fruit Box",
    "MedCity Smiles",
    "Healthy Morning Breakfast",
    "Berrybeats Cafe",
  ],
  authors: [{ name: "Humming Drops" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="humming" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-canvas text-content-primary antialiased transition-brand">
        <BrandThemeProvider>
          <div className="flex min-h-screen flex-col">
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </div>
        </BrandThemeProvider>
      </body>
    </html>
  );
}
