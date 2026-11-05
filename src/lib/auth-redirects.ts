/**
 * Authentication and route redirect security helpers for Humming Drops.
 * Ensures open-redirect prevention and canonical subscription route preservation.
 */

export const VALID_PLAN_TIERS = ["standard", "premium"] as const;
export type ValidPlanTier = (typeof VALID_PLAN_TIERS)[number];

/**
 * Validates whether an incoming plan string is one of the supported tiers.
 */
export function isValidPlanTier(plan: string | null | undefined): plan is ValidPlanTier {
  return plan === "standard" || plan === "premium";
}

/**
 * Validates that a redirect URL is a safe, relative, internal application path.
 * Rejects protocol-relative URLs (//), backslashes, whitespace, and external domains.
 */
export function isSafeRedirectUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;

  // Must start with '/' and not '//' or '/\' (protocol-relative attacks)
  if (!url.startsWith("/") || url.startsWith("//") || url.startsWith("/\\")) {
    return false;
  }

  // Reject characters that could manipulate URLs or inject headers
  if (/[\s\\<>"]/.test(url)) {
    return false;
  }

  try {
    const dummyOrigin = "https://hummingdrops.internal";
    const parsed = new URL(url, dummyOrigin);

    // Ensure origin didn't mutate (e.g. via clever host-relative parsing)
    if (parsed.origin !== dummyOrigin) {
      return false;
    }

    // Must be http/https
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Constructs the canonical safe subscription return URL from an incoming query search string or plan.
 * Only preserves valid plan parameters ('standard' | 'premium').
 */
export function getSafeSubscriptionReturnUrl(planParam: string | null | undefined): string {
  if (isValidPlanTier(planParam)) {
    return `/subscribe?plan=${planParam}`;
  }
  return "/subscribe";
}

/**
 * Resolves the registration URL with an appropriately encoded, safe return destination.
 */
export function buildRegisterRedirectUrl(baseUrl: string | URL, planParam: string | null | undefined): URL {
  const registerUrl = new URL("/register", baseUrl);
  const safeReturn = getSafeSubscriptionReturnUrl(planParam);
  registerUrl.searchParams.set("redirect_url", safeReturn);
  return registerUrl;
}

