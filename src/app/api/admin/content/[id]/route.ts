import { NextResponse } from "next/server";
import { apiError, isUuid } from "@/lib/api-response";
import { auth } from "@/lib/auth/server";
import { getAppUserById, hasPermission } from "@/lib/auth/server";
import {
  ContentValidationFailure,
  getContentPageById,
  listAuditLogsForPage,
  updateContentPageDraft,
} from "@/lib/content-storage";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("content:write"))) {
    return apiError("Forbidden", 403);
  }

  const { id } = await params;
  if (!isUuid(id)) return apiError("Invalid id.", 400);
  const row = await getContentPageById(id);
  if (!row) return apiError("Content page not found.", 404);

  const auditLogs = await listAuditLogsForPage(id);
  return NextResponse.json({ page: row.page, template: row.template, auditLogs });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("content:write"))) {
    return apiError("Forbidden", 403);
  }

  const appUser = await getAppUserById(userId);
  if (!appUser) return apiError("Application account not linked", 404);

  const { id } = await params;
  if (!isUuid(id)) return apiError("Invalid id.", 400);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return apiError("Invalid request body", 400);
  }

  const { title, data } = body as { title?: string; data?: Record<string, unknown> };
  if (typeof title !== "string" || !title.trim() || title.length > 150 || title.includes("\u0000")) {
    return apiError("title must be 1 to 150 characters of text.", 400);
  }

  // Saving a published page changes the live site, so it needs publish rights.
  const existing = await getContentPageById(id);
  if (existing?.page.status === "published" && !(await hasPermission("content:publish"))) {
    return apiError("Publishing rights are required to edit a live page.", 403);
  }

  try {
    const page = await updateContentPageDraft({ id, title, data: data ?? {}, actorUserId: appUser.id });
    return NextResponse.json({ success: true, page });
  } catch (error) {
    if (error instanceof ContentValidationFailure) {
      return apiError("Some fields need fixing.", 400, { details: error.errors });
    }
    if (error instanceof Error && error.message === "Content page not found.") {
      return apiError(error.message, 404);
    }
    console.error("[ADMIN CONTENT UPDATE ERROR]:", error);
    return apiError("Failed to update content page.", 500);
  }
}
