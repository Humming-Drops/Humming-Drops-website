export type BrandMode = "humming" | "medcity";

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface NavCTA {
  label: string;
  href: string;
}

export interface BrandNavConfig {
  mode: BrandMode;
  name: string;
  tagline: string;
  logoSrc: string;
  logoAlt: string;
  navItems: NavItem[];
  primaryCTA: NavCTA;
  secondaryCTA: NavCTA;
}

export const HUMMING_DROPS_NAV: BrandNavConfig = {
  mode: "humming",
  name: "Humming Drops",
  tagline: "Healthy Drops, Healthier you",
  logoSrc: "/images/humming-drops-logo.png",
  logoAlt: "Humming Drops Official Logo",
  navItems: [
    { label: "Plans & Pricing", href: "/plans" },
    { label: "MedCity Smiles", href: "/medcity-smiles" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  primaryCTA: {
    label: "Subscribe Now",
    href: "/subscribe",
  },
  secondaryCTA: {
    label: "Sign In",
    href: "/login",
  },
};

export const MEDCITY_SMILES_NAV: BrandNavConfig = {
  mode: "medcity",
  name: "MedCity Smiles",
  tagline: "Fuel Your Brain, Calm Your Mind",
  logoSrc: "/images/medcity-smiles-logo.png",
  logoAlt: "MedCity Smiles Community Logo",
  navItems: [
    { label: "Mind & Community", href: "/medcity-smiles#pillars" },
    { label: "Health Vitals", href: "/medcity-smiles#vitals" },
    { label: "Breakfast Box Plans", href: "/plans" },
    { label: "About", href: "/about" },
  ],
  primaryCTA: {
    label: "Join Community",
    href: "/subscribe",
  },
  secondaryCTA: {
    label: "Sign In",
    href: "/login",
  },
};

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

export const SHARED_FOOTER_CONFIG = {
  phone: "8618902810",
  email: "hummingdrops@gmail.com",
  location: "Berrybeats Cafe, Bangalore",
  partners: "In partnership with Berrybeats Cafe & MedCity Health Labs",
  linkGroups: [
    {
      title: "Navigation",
      links: [
        { label: "Subscription Plans", href: "/plans" },
        { label: "MedCity Smiles Community", href: "/medcity-smiles" },
        { label: "Subscribe", href: "/subscribe" },
      ],
    },
    {
      title: "Organization",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Subscriber Portal",
      links: [
        { label: "Sign In", href: "/login" },
        { label: "Register", href: "/register" },
        { label: "Dashboard", href: "/dashboard" },
      ],
    },
  ],
};
