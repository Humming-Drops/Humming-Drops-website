import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAppUserByClerkId, hasPermission } from "@/lib/clerk-auth";
import { ContentValidationFailure, createContentPage, listContentPages } from "@/lib/content-storage";

export async function GET() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("content:write"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await listContentPages();
  return NextResponse.json({ pages: rows });
}

export async function POST(request: Request) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("content:write"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const appUser = await getAppUserByClerkId(clerkUserId);
  if (!appUser) return NextResponse.json({ error: "Application account not linked" }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { templateId, slug, title, data } = body as {
    templateId?: string;
    slug?: string;
    title?: string;
    data?: Record<string, unknown>;
  };

  if (!templateId || !slug || !title) {
    return NextResponse.json({ error: "templateId, slug, and title are required." }, { status: 400 });
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
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    if (error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "A page with this slug already exists." }, { status: 409 });
    }
    console.error("[ADMIN CONTENT CREATE ERROR]:", error);
    return NextResponse.json({ error: "Failed to create content page." }, { status: 500 });
  }
}
