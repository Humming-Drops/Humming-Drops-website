import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { hasPermission } from "@/lib/clerk-auth";
import { listSubscriptionsForAdmin } from "@/lib/subscription-admin";

export async function GET() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("subscriptions:manage"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await listSubscriptionsForAdmin();
  return NextResponse.json({ subscriptions: rows });
}
