import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { healthVitals, users } from "@/lib/db/schema";

export async function GET() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1);
  if (!user) return NextResponse.json({ error: "Application account not linked" }, { status: 404 });
  const vitals = await db.select().from(healthVitals).where(eq(healthVitals.userId, user.id));
  return NextResponse.json({ vitals });
}
