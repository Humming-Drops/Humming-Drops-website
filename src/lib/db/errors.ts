/**
 * Postgres error helpers.
 *
 * Drizzle wraps driver errors (DrizzleQueryError) and puts the original
 * postgres-js error on `.cause`, so checking `error.code` alone misses them.
 * These helpers look at the error and its cause chain.
 */

type PgLikeError = { code?: unknown; constraint_name?: unknown; constraint?: unknown; cause?: unknown };

function findPgError(error: unknown, depth = 0): PgLikeError | null {
  if (!error || typeof error !== "object" || depth > 4) return null;
  const e = error as PgLikeError;
  if (typeof e.code === "string" && /^[0-9A-Z]{5}$/.test(e.code)) return e;
  return findPgError(e.cause, depth + 1);
}

/** True when the error (or its cause) is a Postgres unique-constraint violation (23505). */
export function isUniqueViolation(error: unknown): boolean {
  return findPgError(error)?.code === "23505";
}

/** Name of the violated constraint, when the driver reports it. */
export function violatedConstraint(error: unknown): string {
  const pg = findPgError(error);
  const name = pg?.constraint_name ?? pg?.constraint;
  return typeof name === "string" ? name : "";
}
