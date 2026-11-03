export class ProductionPersistenceError extends Error {}

/**
 * Shared production fail-closed policy for every hybrid (Postgres-or-JSON)
 * repository in this codebase. When PostgreSQL isn't configured, local
 * JSON file persistence is acceptable in development/test, but a
 * production environment must fail loudly rather than silently write
 * business records to an ephemeral container filesystem.
 */
export function assertProductionPersistenceAllowed(
  resourceLabel: string,
  isDatabaseConfigured: boolean,
  nodeEnv: string | undefined
): void {
  if (isDatabaseConfigured) return;
  if (nodeEnv === "production") {
    throw new ProductionPersistenceError(
      `DATABASE_URL is not configured in production. Refusing to silently fall back to local JSON file persistence for ${resourceLabel}.`
    );
  }
}
