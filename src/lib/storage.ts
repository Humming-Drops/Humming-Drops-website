import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { uploadBuffer } from "@/lib/cloudinary";
import { assertProductionPersistenceAllowed } from "@/lib/production-persistence-guard";

/**
 * Hybrid file storage, mirroring the existing Hybrid*Repository pattern
 * (lead-storage.ts, payment-storage.ts): Cloudinary when configured,
 * local disk only in development/test when it isn't. Fails closed in
 * production, same as the database hybrid repositories.
 */

const LOCAL_STORAGE_ROOT = path.join(process.cwd(), ".local-storage");

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function sanitizeSegment(segment: string): string {
  const cleaned = segment.replace(/[^a-zA-Z0-9_-]/g, "_");
  if (!cleaned) throw new Error("Invalid storage path segment.");
  return cleaned;
}

export interface UploadResult {
  url: string;
  provider: "cloudinary" | "local";
}

export async function uploadFile(
  buffer: Buffer,
  options: { folder: string; filename?: string }
): Promise<UploadResult> {
  const configured = isCloudinaryConfigured();
  assertProductionPersistenceAllowed("file storage", configured, process.env.NODE_ENV);

  const folder = sanitizeSegment(options.folder);

  if (configured) {
    const result = await uploadBuffer(buffer, { folder, publicId: options.filename });
    return { url: result.secure_url, provider: "cloudinary" };
  }

  const filename = sanitizeSegment(options.filename ?? randomUUID());
  const dir = path.join(LOCAL_STORAGE_ROOT, folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);

  return { url: `/api/local-storage/${folder}/${filename}`, provider: "local" };
}

export function getLocalStorageRoot(): string {
  return LOCAL_STORAGE_ROOT;
}
