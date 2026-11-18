import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/auth/server";
import { paymentRepository } from "@/lib/payment-storage";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!(await hasPermission("payments:read"))) {
    return apiError("Forbidden", 403);
  }

  const [orders, transactions] = await Promise.all([
    paymentRepository.listOrders(),
    paymentRepository.listTransactions(),
  ]);

  return NextResponse.json({ orders, transactions });
}
