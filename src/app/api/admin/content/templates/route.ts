import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/auth/server";
import { listActiveTemplates } from "@/lib/content-storage";

export async function GET() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("content:write"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const templates = await listActiveTemplates();
  return NextResponse.json({ templates });
}
