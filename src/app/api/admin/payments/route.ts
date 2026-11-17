import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/auth/server";
import { paymentRepository } from "@/lib/payment-storage";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission("payments:read"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [orders, transactions] = await Promise.all([
    paymentRepository.listOrders(),
    paymentRepository.listTransactions(),
  ]);

  return NextResponse.json({ orders, transactions });
}
