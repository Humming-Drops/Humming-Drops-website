import { NextResponse } from "next/server";
import { MIN_PASSWORD_LENGTH, resetPasswordWithToken } from "@/lib/auth/password-reset";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON in request payload." }, { status: 400 });
  }
  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!token) {
    return NextResponse.json({ success: false, error: "Reset link is invalid or has expired." }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { success: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` },
      { status: 400 }
    );
  }

  try {
    const ok = await resetPasswordWithToken(token, password);
    if (!ok) {
      return NextResponse.json({ success: false, error: "Reset link is invalid or has expired." }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "Password updated. You can now sign in." });
  } catch (error) {
    console.error("[RESET PASSWORD ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to reset password." }, { status: 500 });
  }
}
