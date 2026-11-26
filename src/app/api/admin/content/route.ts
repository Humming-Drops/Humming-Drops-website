import { NextResponse } from "next/server";
import { apiError, isUuid } from "@/lib/api-response";
import { auth } from "@/lib/auth/server";
import { getAppUserById, hasPermission } from "@/lib/auth/server";
import { ContentValidationFailure, createContentPage, listContentPages } from "@/lib/content-storage";
import { isUniqueViolation } from "@/lib/db/errors";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("content:write"))) {
    return apiError("Forbidden", 403);
  }

  const rows = await listContentPages();
  return NextResponse.json({ pages: rows });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("content:write"))) {
    return apiError("Forbidden", 403);
  }

  const appUser = await getAppUserById(userId);
  if (!appUser) return apiError("Application account not linked", 404);

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return apiError("Invalid request body", 400);
  }

  const { templateId, slug, title, data } = body as {
    templateId?: string;
    slug?: string;
    title?: string;
    data?: Record<string, unknown>;
  };

  if (!templateId || !slug || !title) {
    return apiError("templateId, slug, and title are required.", 400);
  }

  if (!isUuid(templateId)) {
    return apiError("templateId must be a valid template id.", 400);
  }

  try {
    const page = await createContentPage({
      templateId,
      slug,
      title,
      data: data ?? {},
      actorUserId: appUser.id,
    });
    return NextResponse.json({ success: true, page }, { status: 201 });
  } catch (error) {
    if (error instanceof ContentValidationFailure) {
      return apiError("Some fields need fixing.", 400, { details: error.errors });
    }
    if (isUniqueViolation(error)) {
      return apiError("A page with this slug already exists. Choose a different slug.", 409, {
        details: [{ field: "slug", message: "This slug is already used by another page." }],
      });
    }
    console.error("[ADMIN CONTENT CREATE ERROR]:", error);
    return apiError("Failed to create content page.", 500);
  }
}
