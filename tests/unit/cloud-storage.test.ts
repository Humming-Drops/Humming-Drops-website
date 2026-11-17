import { describe, it, expect, vi } from "vitest";
import { isCloudinaryConfigured, uploadFile, getLocalStorageRoot } from "../../src/lib/storage";
import { assertProductionPersistenceAllowed, ProductionPersistenceError } from "../../src/lib/production-persistence-guard";
import path from "node:path";

describe("Cloud Storage & Hybrid Storage Features", () => {
  it("detects whether Cloudinary credentials are fully configured", () => {
    const originalCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const originalApiKey = process.env.CLOUDINARY_API_KEY;
    const originalApiSecret = process.env.CLOUDINARY_API_SECRET;

    process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
    process.env.CLOUDINARY_API_KEY = "test-key";
    process.env.CLOUDINARY_API_SECRET = "test-secret";

    expect(isCloudinaryConfigured()).toBe(true);

    delete process.env.CLOUDINARY_CLOUD_NAME;
    expect(isCloudinaryConfigured()).toBe(false);

    // Restore
    process.env.CLOUDINARY_CLOUD_NAME = originalCloudName;
    process.env.CLOUDINARY_API_KEY = originalApiKey;
    process.env.CLOUDINARY_API_SECRET = originalApiSecret;
  });

  it("fails closed in production if storage is unconfigured", () => {
    expect(() => {
      assertProductionPersistenceAllowed("file storage", false, "production");
    }).toThrow(ProductionPersistenceError);
  });

  it("permits fallback outside production environment", () => {
    expect(() => {
      assertProductionPersistenceAllowed("file storage", false, "development");
    }).not.toThrow();

    expect(() => {
      assertProductionPersistenceAllowed("file storage", false, "test");
    }).not.toThrow();
  });

  it("returns correct local storage root path", () => {
    const root = getLocalStorageRoot();
    expect(root).toBe(path.join(process.cwd(), ".local-storage"));
  });
});
