import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const current = await getCurrentUser();

  if (!current) {
    return NextResponse.json({
      success: true,
      authenticated: false,
      user: null,
    });
  }

  const { user, profile, session } = current;

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: profile?.fullName || session.fullName || user.email,
      phone: user.phone || profile?.phone || null,
      role: user.role,
      isActive: user.isActive,
    },
    profile,
  });
}
