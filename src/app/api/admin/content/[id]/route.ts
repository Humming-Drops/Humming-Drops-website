import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAppUserByClerkId, hasPermission } from "@/lib/clerk-auth";
import {
  ContentValidationFailure,
  getContentPageById,
  listAuditLogsForPage,
  updateContentPageDraft,
} from "@/lib/content-storage";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("content:write"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const row = await getContentPageById(id);
  if (!row) return NextResponse.json({ error: "Content page not found." }, { status: 404 });

  const auditLogs = await listAuditLogsForPage(id);
  return NextResponse.json({ page: row.page, template: row.template, auditLogs });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("content:write"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const appUser = await getAppUserByClerkId(clerkUserId);
  if (!appUser) return NextResponse.json({ error: "Application account not linked" }, { status: 404 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, data } = body as { title?: string; data?: Record<string, unknown> };
  if (!title) {
    return NextResponse.json({ error: "title is required." }, { status: 400 });
  }

  try {
    const page = await updateContentPageDraft({ id, title, data: data ?? {}, actorUserId: appUser.id });
    return NextResponse.json({ success: true, page });
  } catch (error) {
    if (error instanceof ContentValidationFailure) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message === "Content page not found.") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[ADMIN CONTENT UPDATE ERROR]:", error);
    return NextResponse.json({ error: "Failed to update content page." }, { status: 500 });
  }
}
