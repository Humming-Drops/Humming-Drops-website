import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getLocalStorageRoot } from "@/lib/storage";

/**
 * Serves files written by the local-disk storage fallback
 * (src/lib/storage.ts). Only meaningful in development/test -- in
 * production, Cloudinary is mandatory (production-persistence-guard.ts),
 * so this path should never hold real files there. Fails closed anyway.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { path: segments } = await params;
  const root = getLocalStorageRoot();
  const resolved = path.join(root, ...segments);

  if (!resolved.startsWith(root + path.sep) && resolved !== root) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const data = await readFile(resolved);
    return new NextResponse(data, {
      headers: { "Content-Type": "application/octet-stream" },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
