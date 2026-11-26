/**
 * In-memory fixed-window rate limiter. Per server process: enough for the
 * single-instance deployment; move to a shared store before scaling out.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

function bucket(key: string, windowMs: number, now: number) {
  let b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    if (buckets.size > 10_000) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }
  return b;
}

export function isRateLimited(key: string, limit: number, windowMs = FIFTEEN_MINUTES_MS, now = Date.now()): boolean {
  return bucket(key, windowMs, now).count >= limit;
}

export function recordAttempt(key: string, windowMs = FIFTEEN_MINUTES_MS, now = Date.now()): void {
  bucket(key, windowMs, now).count += 1;
}

export function clearAttempts(key: string): void {
  buckets.delete(key);
}

/** Last x-forwarded-for hop: the one added by the trusted proxy, not the client. */
export function clientIp(request: Request): string {
  const hops = request.headers.get("x-forwarded-for")?.split(",") ?? [];
  return hops[hops.length - 1]?.trim() || "unknown";
}

export const TOO_MANY_ATTEMPTS = "Too many attempts. Please wait 15 minutes and try again.";
