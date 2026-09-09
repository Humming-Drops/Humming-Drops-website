export type BrandMode = "humming" | "medcity";

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface BrandConfig {
  mode: BrandMode;
  name: string;
  tagline: string;
  primaryColor: string;
  themeClass: string;
  navItems: NavItem[];
}
