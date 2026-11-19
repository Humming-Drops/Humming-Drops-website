import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { passwordResetTokens, users } from "@/lib/db/schema";
import { hashPassword } from "./password";

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
export const RESET_REQUEST_COOLDOWN_MS = 60 * 1000; // 1 request / minute / user
export const MIN_PASSWORD_LENGTH = 8;

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a reset token for the user. Returns the raw token (to be emailed),
 * or null when rate-limited. Earlier unused tokens are invalidated.
 */
export async function createPasswordResetToken(userId: string): Promise<string | null> {
  const recent = await db
    .select({ id: passwordResetTokens.id })
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.userId, userId),
        gt(passwordResetTokens.createdAt, new Date(Date.now() - RESET_REQUEST_COOLDOWN_MS))
      )
    )
    .limit(1);
  if (recent.length > 0) return null;

  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(passwordResetTokens.userId, userId), isNull(passwordResetTokens.usedAt)));

  const token = randomBytes(32).toString("base64url");
  await db.insert(passwordResetTokens).values({
    userId,
    tokenHash: hashResetToken(token),
    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
  });
  return token;
}

/**
 * Atomically consumes a valid token and sets the new password.
 * Returns true on success, false for invalid/expired/used tokens.
 */
export async function resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
  const passwordHash = await hashPassword(newPassword);
  return db.transaction(async (tx) => {
    const [row] = await tx
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(
        and(
          eq(passwordResetTokens.tokenHash, hashResetToken(token)),
          isNull(passwordResetTokens.usedAt),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      )
      .returning({ userId: passwordResetTokens.userId });
    if (!row) return false;

    await tx
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, row.userId));
    return true;
  });
}
