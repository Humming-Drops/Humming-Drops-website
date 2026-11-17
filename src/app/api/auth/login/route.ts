import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  getSessionCookieOptions,
} from "@/lib/auth/session";
import { isValidEmail } from "@/lib/sanitization";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request payload." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Request payload must be a JSON object." },
        { status: 400 }
      );
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Please enter your password." },
        { status: 400 }
      );
    }

    // 1. Query User from PostgreSQL
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 2. Account Status Check
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "Your account is currently inactive. Please contact support.",
        },
        { status: 403 }
      );
    }

    // 3. Verify Password Hash
    const passwordMatch = await verifyPassword(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 4. Fetch Profile Details
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1);

    const fullName = profile?.fullName || user.email;

    // 5. Issue Signed Session Token
    const sessionToken = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName,
    });

    // 6. Return Response with Secure Cookie
    const response = NextResponse.json({
      success: true,
      message: "Signed in successfully.",
      user: {
        id: user.id,
        email: user.email,
        fullName,
        role: user.role,
      },
    });

    const cookieOpts = getSessionCookieOptions();
    response.cookies.set(cookieOpts.name, sessionToken, cookieOpts);

    return response;
  } catch (error: any) {
    console.error("[LOGIN API ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sign in." },
      { status: 500 }
    );
  }
}
