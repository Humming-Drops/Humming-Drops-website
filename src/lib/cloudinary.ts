import { v2 as cloudinary, type UploadApiErrorResponse, type UploadApiResponse } from "cloudinary";

/**
 * Cloudinary storage client. Scaffolding for future file/image upload
 * features (e.g. CMS media, diagnostic PDFs) -- nothing in the app
 * uploads through this yet. CLOUDINARY_API_SECRET must never be
 * exposed to the client; only CLOUDINARY_CLOUD_NAME is safe to prefix
 * with NEXT_PUBLIC_ if a client-side unsigned widget is ever added.
 */

let configured = false;

function ensureConfigured() {
  if (configured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  configured = true;
}

export async function uploadBuffer(
  buffer: Buffer,
  options: { folder: string; publicId?: string }
): Promise<UploadApiResponse> {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: options.folder, public_id: options.publicId, resource_type: "auto" },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload returned no result."));
          return;
        }
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

export function getCloudinaryClient() {
  ensureConfigured();
  return cloudinary;
}
