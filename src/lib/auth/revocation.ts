import { createHash } from "node:crypto";
import { eq, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { revokedSessions } from "@/lib/db/schema";

export function passwordFingerprint(passwordHash: string | null | undefined): string {
  return createHash("sha256").update(passwordHash ?? "").digest("hex").slice(0, 16);
}

// Both functions tolerate a missing table so a deploy made before migration
// 0010 keeps working (sign-out then only clears the cookie, as before).
export async function revokeSession(jti: string, expiresAtSeconds: number): Promise<void> {
  try {
    await db.delete(revokedSessions).where(lt(revokedSessions.expiresAt, new Date()));
    await db
      .insert(revokedSessions)
      .values({ jti, expiresAt: new Date(expiresAtSeconds * 1000) })
      .onConflictDoNothing();
  } catch (error) {
    console.error("[SESSION REVOKE ERROR] Is migration 0010 applied?", (error as Error).message);
  }
}

export async function isSessionRevoked(jti: string): Promise<boolean> {
  try {
    const rows = await db.select({ jti: revokedSessions.jti }).from(revokedSessions).where(eq(revokedSessions.jti, jti)).limit(1);
    return rows.length > 0;
  } catch {
    return false;
  }
}
