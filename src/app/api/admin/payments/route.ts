import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { hasPermission } from "@/lib/clerk-auth";
import { paymentRepository } from "@/lib/payment-storage";

export async function GET() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("payments:read"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [orders, transactions] = await Promise.all([
    paymentRepository.listOrders(),
    paymentRepository.listTransactions(),
  ]);

  return NextResponse.json({ orders, transactions });
}
