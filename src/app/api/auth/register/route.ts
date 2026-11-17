import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  getSessionCookieOptions,
} from "@/lib/auth/session";
import {
  isValidEmail,
  normalizePhone,
  isValidIndianPhone,
  sanitizeString,
} from "@/lib/sanitization";

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

    // 1. Sanitize & Validate Email
    const rawEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!rawEmail || !isValidEmail(rawEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // 2. Validate Password
    const password = typeof body.password === "string" ? body.password : "";
    if (!password || password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // 3. Extract & Validate Full Name
    const rawFullName = body.fullName || `${body.firstName || ""} ${body.lastName || ""}`.trim();
    const fullName = sanitizeString(rawFullName, 100);
    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name (at least 2 characters)." },
        { status: 400 }
      );
    }

    // 4. Validate Phone (optional at signup, but validated if provided)
    let phone: string | null = null;
    if (body.phone) {
      const normalized = normalizePhone(body.phone);
      if (!isValidIndianPhone(normalized)) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid 10-digit Indian phone number." },
          { status: 400 }
        );
      }
      phone = normalized;
    }

    // 5. Check if User Already Exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, rawEmail))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email address already exists. Please sign in instead.",
        },
        { status: 409 }
      );
    }

    // 6. Hash Password & Create User
    const passwordHash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        email: rawEmail,
        passwordHash,
        phone,
        role: "customer",
        isActive: true,
      })
      .returning();

    // 7. Create Profile
    await db.insert(profiles).values({
      userId: newUser.id,
      fullName,
      phone: phone || "",
      email: rawEmail,
    });

    // 8. Generate Session Token
    const sessionToken = await createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      fullName,
    });

    // 9. Set Cookie & Return Success
    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

    const cookieOpts = getSessionCookieOptions();
    response.cookies.set(cookieOpts.name, sessionToken, cookieOpts);

    return response;
  } catch (error: any) {
    console.error("[REGISTER API ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create account." },
      { status: 500 }
    );
  }
}
