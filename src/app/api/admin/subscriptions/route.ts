import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/auth/server";
import { listSubscriptionsForAdmin } from "@/lib/subscription-admin";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("subscriptions:manage"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await listSubscriptionsForAdmin();
  return NextResponse.json({ subscriptions: rows });
}
