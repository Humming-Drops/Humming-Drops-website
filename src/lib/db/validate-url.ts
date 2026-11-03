export interface DatabaseUrlValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a DATABASE_URL beyond "is it set": correct scheme, has a
 * host and database name, and — when targeting production — refuses a
 * localhost/loopback host and flags a missing sslmode. This exists so a
 * misconfigured connection string fails with a specific, actionable
 * message instead of an opaque connection error deep inside `postgres`.
 */
export function validateDatabaseUrl(
  url: string | undefined,
  nodeEnv: string | undefined
): DatabaseUrlValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!url || url.trim() === "") {
    errors.push("DATABASE_URL is not set.");
    return { valid: false, errors, warnings };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    errors.push("DATABASE_URL is not a well-formed URL.");
    return { valid: false, errors, warnings };
  }

  if (parsed.protocol !== "postgres:" && parsed.protocol !== "postgresql:") {
    errors.push(`DATABASE_URL must use the postgres:// or postgresql:// scheme, got "${parsed.protocol}".`);
  }
  if (!parsed.hostname) {
    errors.push("DATABASE_URL is missing a host.");
  }
  if (!parsed.pathname || parsed.pathname === "/") {
    errors.push("DATABASE_URL is missing a database name.");
  }
  if (!parsed.username) {
    warnings.push("DATABASE_URL has no username.");
  }

  if (nodeEnv === "production") {
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
      errors.push(
        `Refusing to treat a localhost DATABASE_URL ("${host}") as a valid production target.`
      );
    }

    const sslMode = parsed.searchParams.get("sslmode");
    if (sslMode !== "require" && sslMode !== "verify-full" && sslMode !== "verify-ca") {
      warnings.push(
        "Production DATABASE_URL should set sslmode=require (or stricter); none was found."
      );
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
