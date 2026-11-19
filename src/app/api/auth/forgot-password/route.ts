import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { isValidEmail } from "@/lib/sanitization";
import { createPasswordResetToken } from "@/lib/auth/password-reset";
import { sendMail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

// Same response whether or not the account exists (no user enumeration).
const GENERIC = {
  success: true,
  message: "If an account exists for that email, a password reset link has been sent.",
};

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON in request payload." }, { status: 400 });
  }
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ success: false, error: "Please provide a valid email address." }, { status: 400 });
  }

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (user && user.isActive) {
      const token = await createPasswordResetToken(user.id);
      if (token) {
        const base = (process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin).replace(/\/$/, "");
        await sendMail({
          to: user.email,
          subject: "Reset your Humming Drops password",
          text:
            "We received a request to reset your Humming Drops password.\n\n" +
            `Reset link (valid for 1 hour, single use):\n${base}/reset-password?token=${token}\n\n` +
            "If you did not request this, you can safely ignore this email.",
        });
      }
    }
  } catch (error) {
    console.error("[FORGOT PASSWORD ERROR]", error);
  }
  return NextResponse.json(GENERIC);
}
