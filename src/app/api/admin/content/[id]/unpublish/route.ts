import { NextResponse } from "next/server";
import { apiError, isUuid } from "@/lib/api-response";
import { auth } from "@/lib/auth/server";
import { getAppUserById, hasPermission } from "@/lib/auth/server";
import { unpublishContentPage } from "@/lib/content-storage";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("content:publish"))) {
    return apiError("Forbidden", 403);
  }

  const appUser = await getAppUserById(userId);
  if (!appUser) return apiError("Application account not linked", 404);

  const { id } = await params;
  if (!isUuid(id)) return apiError("Invalid id.", 400);
  try {
    const page = await unpublishContentPage(id, appUser.id);
    return NextResponse.json({ success: true, page });
  } catch (error) {
    if (error instanceof Error && error.message === "Content page not found.") {
      return apiError(error.message, 404);
    }
    console.error("[ADMIN CONTENT UNPUBLISH ERROR]:", error);
    return apiError("Failed to unpublish content page.", 500);
  }
}
