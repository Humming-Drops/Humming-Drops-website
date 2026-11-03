import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAppUserByClerkId, hasPermission } from "@/lib/clerk-auth";
import { unpublishContentPage } from "@/lib/content-storage";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("content:publish"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const appUser = await getAppUserByClerkId(clerkUserId);
  if (!appUser) return NextResponse.json({ error: "Application account not linked" }, { status: 404 });

  const { id } = await params;
  try {
    const page = await unpublishContentPage(id, appUser.id);
    return NextResponse.json({ success: true, page });
  } catch (error) {
    if (error instanceof Error && error.message === "Content page not found.") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[ADMIN CONTENT UNPUBLISH ERROR]:", error);
    return NextResponse.json({ error: "Failed to unpublish content page." }, { status: 500 });
  }
}
