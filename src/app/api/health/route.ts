import { NextResponse } from "next/server";
import { leadRepository } from "@/lib/lead-storage";

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

  // System memory diagnostics
  const memoryUsage = process.memoryUsage();
  const memorySummary = {
    rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
    heapTotalMb: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
    heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
  };

  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      environment: appEnv,
      version: "0.1.0",
      responseTimeMs,
      services: {
        application: "operational",
        checkoutMode,
        persistenceDriver: leadRepository.getActiveDriverName(),
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: memorySummary,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    }
  );
}
