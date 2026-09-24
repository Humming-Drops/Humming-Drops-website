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
    { label: "Plans", href: "/#pricing" },
    { label: "How it works", href: "/#journey" },
    { label: "MedCity Smiles", href: "/medcity-smiles" },
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
  whatsapp: "8618902810",
  email: "hummingdrops@gmail.com",
  website: "www.hummingdrops.com",
  location: "Berrybeats Cafe, Bangalore",
  partners: "In partnership with Berrybeats Cafe & MedCity Health Labs",
  linkGroups: [
    {
      title: "Shop & Plans",
      links: [
        { label: "Standard Plan (₹3,500/mo)", href: "/subscribe?plan=standard" },
        { label: "Premium Plan (₹4,000/mo)", href: "/subscribe?plan=premium" },
        { label: "What's in the Box", href: "/#box-experience" },
        { label: "How it Works", href: "/#journey" },
      ],
    },
    {
      title: "Know More",
      links: [
        { label: "About Humming Drops", href: "/about" },
        { label: "MedCity Smiles Community", href: "/medcity-smiles" },
        { label: "Contact & Helpline", href: "/contact" },
      ],
    },
    {
      title: "Subscriber Portal",
      links: [
        { label: "Sign In", href: "/login" },
        { label: "Register", href: "/register" },
        { label: "Subscriber Dashboard", href: "/dashboard" },
      ],
    },
  ],
};
