import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/auth/server";
import { listActiveTemplates } from "@/lib/content-storage";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("content:write"))) {
    return apiError("Forbidden", 403);
  }

  const templates = await listActiveTemplates();
  return NextResponse.json({ templates });
}
