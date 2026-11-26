import type { MetadataRoute } from "next";

const BASE = (process.env.NEXT_PUBLIC_APP_URL || "https://www.hummingdrops.com").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/medcity-smiles", "/plans", "/about", "/contact", "/terms", "/privacy"].map((path) => ({
    url: `${BASE}${path}`,
  }));
}
