import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { getSession } from "@/lib/auth/server";
import { revokeSession } from "@/lib/auth/revocation";

export const dynamic = "force-dynamic";

export async function POST() {
  // A copied cookie must stop working too, not just the one in this browser.
  const session = await getSession();
  if (session?.jti) await revokeSession(session.jti, session.exp);

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
