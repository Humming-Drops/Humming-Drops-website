import fs from "node:fs";
import { describe, it, expect, vi, afterEach } from "vitest";

// Serverless hosts (Vercel) mount the app directory read-only. Loading the
// storage modules must not write, or every route that imports them returns 500.
afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

function readOnlyFilesystem() {
  const refuse = () => {
    throw Object.assign(new Error("EROFS: read-only file system"), { code: "EROFS" });
  };
  vi.spyOn(fs, "existsSync").mockReturnValue(false);
  return [vi.spyOn(fs, "mkdirSync").mockImplementation(refuse), vi.spyOn(fs, "writeFileSync").mockImplementation(refuse)];
}

describe("storage modules on a read-only filesystem", () => {
  it.each(["@/lib/lead-storage", "@/lib/payment-storage"])("%s loads without writing", async (modulePath) => {
    const writes = readOnlyFilesystem();
    await expect(import(modulePath)).resolves.toBeTruthy();
    for (const write of writes) expect(write).not.toHaveBeenCalled();
  });
});
