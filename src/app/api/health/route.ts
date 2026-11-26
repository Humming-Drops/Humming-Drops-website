import { NextResponse } from "next/server";
import { leadRepository } from "@/lib/lead-storage";
import { getDatabaseClient, isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Health Check API Endpoint (/api/health)
 *
 * Used by Railway PaaS orchestration, load balancers, and container health monitors
 * for zero-downtime rolling deployments and uptime verification.
 */
export async function GET() {
  const startTime = Date.now();
  const uptimeSeconds = Math.floor(process.uptime());

  // Determine current environment and checkout configuration
  const nodeEnv = process.env.NODE_ENV || "development";
  const appEnv = process.env.APP_ENV || nodeEnv;
  const checkoutMode = process.env.CHECKOUT_MODE || "assisted_lead";

  // Real dependency check: a deploy that cannot reach its database must fail
  // the platform healthcheck (503) instead of receiving traffic.
  let database: "operational" | "unreachable" | "not_configured" = "not_configured";
  if (isDatabaseConfigured()) {
    try {
      await Promise.race([
        getDatabaseClient()`select 1`,
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
      ]);
      database = "operational";
    } catch {
      database = "unreachable";
    }
  }
  const healthy = database !== "unreachable";

  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      environment: appEnv,
      version: "0.1.0",
      responseTimeMs,
      services: {
        application: "operational",
        database,
        checkoutMode,
        persistenceDriver: leadRepository.getActiveDriverName(),
      },
    },
    {
      status: healthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    }
  );
}
