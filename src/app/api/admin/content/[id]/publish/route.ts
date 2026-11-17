import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getAppUserById, hasPermission } from "@/lib/auth/server";
import { publishContentPage } from "@/lib/content-storage";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("content:publish"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const appUser = await getAppUserById(userId);
  if (!appUser) return NextResponse.json({ error: "Application account not linked" }, { status: 404 });

  const { id } = await params;
  try {
    const page = await publishContentPage(id, appUser.id);
    return NextResponse.json({ success: true, page });
  } catch (error) {
    if (error instanceof Error && error.message === "Content page not found.") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[ADMIN CONTENT PUBLISH ERROR]:", error);
    return NextResponse.json({ error: "Failed to publish content page." }, { status: 500 });
  }
}
