import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { OFFICIAL_CONTACT, DEFAULT_CHECKOUT_MODE } from "../../src/lib/checkout-config";
import { OFFICIAL_PLANS } from "../../src/types/plans";

describe("Production Build Smoke Tests", () => {
  const rootDir = process.cwd();
  const nextDir = path.join(rootDir, ".next");
  const routesManifestPath = path.join(nextDir, "routes-manifest.json");
  const buildManifestPath = path.join(nextDir, "build-manifest.json");
  const serverDir = path.join(nextDir, "server");
  const staticDir = path.join(nextDir, "static");

  it("verifies production build directory structure exists", () => {
    expect(fs.existsSync(nextDir)).toBe(true);
    expect(fs.existsSync(serverDir)).toBe(true);
    expect(fs.existsSync(staticDir)).toBe(true);
  });

  it("verifies security headers configuration in routes manifest", () => {
    expect(fs.existsSync(routesManifestPath)).toBe(true);
    const routesManifest = JSON.parse(fs.readFileSync(routesManifestPath, "utf8"));

    expect(routesManifest.headers).toBeDefined();
    expect(routesManifest.headers.length).toBeGreaterThan(0);

    const globalHeaders = routesManifest.headers[0]?.headers || [];
    const headerMap = Object.fromEntries(globalHeaders.map((h: any) => [h.key, h.value]));

    expect(headerMap["X-Content-Type-Options"]).toBe("nosniff");
    expect(headerMap["X-Frame-Options"]).toBe("DENY");
    expect(headerMap["X-XSS-Protection"]).toBe("1; mode=block");
    expect(headerMap["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });

  it("verifies client bundle manifests and static chunks exist", () => {
    expect(fs.existsSync(buildManifestPath)).toBe(true);
    const buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, "utf8"));
    expect(buildManifest).toBeDefined();

    const staticSubDirs = fs.readdirSync(staticDir);
    expect(staticSubDirs.length).toBeGreaterThan(0);
    expect(staticSubDirs).toContain("chunks");
  });

  it("verifies source route completeness across all 19 application and API endpoints", () => {
    const appDir = path.join(rootDir, "src", "app");

    const expectedPages = [
      path.join(appDir, "page.tsx"),
      path.join(appDir, "medcity-smiles", "page.tsx"),
      path.join(appDir, "plans", "page.tsx"),
      path.join(appDir, "subscribe", "page.tsx"),
      path.join(appDir, "about", "page.tsx"),
      path.join(appDir, "contact", "page.tsx"),
      path.join(appDir, "login", "page.tsx"),
      path.join(appDir, "register", "page.tsx"),
      path.join(appDir, "forgot-password", "page.tsx"),
      path.join(appDir, "dashboard", "page.tsx"),
      path.join(appDir, "dashboard", "overview", "page.tsx"),
      path.join(appDir, "dashboard", "delivery", "page.tsx"),
      path.join(appDir, "dashboard", "health", "page.tsx"),
      path.join(appDir, "dashboard", "community", "page.tsx"),
      path.join(appDir, "dashboard", "settings", "page.tsx"),
    ];

    const expectedApiRoutes = [
      path.join(appDir, "api", "health", "route.ts"),
      path.join(appDir, "api", "subscriptions", "lead", "route.ts"),
      path.join(appDir, "api", "payments", "order", "route.ts"),
      path.join(appDir, "api", "payments", "verify", "route.ts"),
      path.join(appDir, "api", "payments", "webhook", "route.ts"),
    ];

    for (const pageFile of expectedPages) {
      expect(fs.existsSync(pageFile)).toBe(true);
    }

    for (const apiFile of expectedApiRoutes) {
      expect(fs.existsSync(apiFile)).toBe(true);
    }
  });

  it("verifies production configuration sanity and client brochure grounding", () => {
    expect(DEFAULT_CHECKOUT_MODE).toBe("assisted_lead");
    expect(OFFICIAL_CONTACT.phone).toBe("8618902810");
    expect(OFFICIAL_CONTACT.email).toBe("hummingdrops@gmail.com");
    expect(OFFICIAL_CONTACT.website).toBe("www.hummingdrops.com");
    expect(OFFICIAL_CONTACT.kitchenLocation).toContain("Berrybeats cafe");
    expect(OFFICIAL_CONTACT.partners.medCityLabs).toBe("MedCity Health Labs");
    expect(OFFICIAL_CONTACT.partners.berrybeats).toBe("CARE by Berrybeats");

    expect(OFFICIAL_PLANS.standard.monthlyPriceINR).toBe(3500);
    expect(OFFICIAL_PLANS.premium.monthlyPriceINR).toBe(4000);
  });
});
