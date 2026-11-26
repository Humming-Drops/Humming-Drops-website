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
import { isUniqueViolation, violatedConstraint } from "@/lib/db/errors";
import { clientIp, isRateLimited, recordAttempt, TOO_MANY_ATTEMPTS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const ipKey = `register-ip:${clientIp(request)}`;
    if (isRateLimited(ipKey, 30)) {
      return NextResponse.json({ success: false, error: TOO_MANY_ATTEMPTS }, { status: 429 });
    }
    recordAttempt(ipKey);

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
    if (!rawEmail || rawEmail.length > 254 || !isValidEmail(rawEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // 2. Validate Password
    const password = typeof body.password === "string" ? body.password : "";
    if (!password.trim() || password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { success: false, error: "Password must be 8 to 128 characters long and not only spaces." },
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

    // 5b. Phone is unique on users — check it up front for a clear message.
    if (phone) {
      const [phoneOwner] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.phone, phone))
        .limit(1);
      if (phoneOwner) {
        return NextResponse.json(
          {
            success: false,
            error: "This mobile number is already linked to another account. Sign in, or use a different number.",
            field: "phone",
          },
          { status: 409 }
        );
      }
    }

    // 6. Hash Password, then create user + profile atomically so a failure
    // can never leave a half-created account behind.
    const passwordHash = await hashPassword(password);

    const newUser = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(users)
        .values({
          email: rawEmail,
          passwordHash,
          phone,
          role: "customer",
          isActive: true,
        })
        .returning({ id: users.id, email: users.email, role: users.role });

      // 7. Create Profile
      await tx.insert(profiles).values({
        userId: created.id,
        fullName,
        phone: phone || "",
        email: rawEmail,
      });
      return created;
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
  } catch (error: unknown) {
    // Never echo driver errors to the client: they contain the SQL text and
    // bound parameters (including the password hash).
    if (isUniqueViolation(error)) {
      const onPhone = violatedConstraint(error).includes("phone");
      return NextResponse.json(
        {
          success: false,
          error: onPhone
            ? "This mobile number is already linked to another account. Sign in, or use a different number."
            : "An account with this email address already exists. Please sign in instead.",
          field: onPhone ? "phone" : "email",
        },
        { status: 409 }
      );
    }
    console.error("[REGISTER API ERROR]", error);
    return NextResponse.json(
      { success: false, error: "We couldn't create your account right now. Please try again." },
      { status: 500 }
    );
  }
}
