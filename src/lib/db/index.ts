import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Checks if production PostgreSQL is configured via DATABASE_URL.
 */
export const isDatabaseConfigured = (): boolean => {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "");
};

// Singleton connection & ORM instances
let _client: postgres.Sql | null = null;
let _db: PostgresJsDatabase<typeof schema> | null = null;

/**
 * Returns or initializes the raw postgres connection pool client.
 */
export function getDatabaseClient(): postgres.Sql {
  if (!_client) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not configured. Ensure DATABASE_URL is set in your Railway environment."
      );
    }

    const poolMax = process.env.DATABASE_POOL_MAX
      ? parseInt(process.env.DATABASE_POOL_MAX, 10)
      : 10;

    const enforceSsl =
      process.env.DATABASE_SSL === "require" ||
      process.env.DATABASE_SSL === "true" ||
      process.env.NODE_ENV === "production";

    _client = postgres(url, {
      max: poolMax,
      idle_timeout: 30, // 30 seconds idle timeout
      connect_timeout: 5, // 5 seconds connection timeout
      ...(enforceSsl ? { ssl: "require" } : {}),
    });
  }
  return _client;
}

/**
 * Returns or initializes the Drizzle ORM database instance with relational schema.
 */
export function getDb(): PostgresJsDatabase<typeof schema> {
  if (!_db) {
    const client = getDatabaseClient();
    _db = drizzle(client, { schema });
  }
  return _db;
}

/**
 * Proxy export for `db` to allow clean `import { db } from "@/lib/db"`.
 * Lazily evaluates on first call so that offline builds and environments without
 * DATABASE_URL do not fail module evaluation during Next.js builds.
 */
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop) {
    const instance = getDb();
    const value = (instance as unknown as Record<string, unknown>)[prop as string];
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(instance);
    }
    return value;
  },
});

export * from "./schema";
