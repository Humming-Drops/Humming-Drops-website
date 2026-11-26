import type { Metadata } from "next";
import { hasPermission } from "@/lib/auth/server";
import { paymentRepository } from "@/lib/payment-storage";
import { EmptyTableState, StatusBadge } from "@/components/admin/status-badge";
import { AdminPageHeader, AdminSectionHeading, adminTable } from "@/components/admin/admin-ui";

export default async function AdminPaymentsPage() {
  const canRead = await hasPermission("payments:read");
  if (!canRead) {
    return (
      <div className="rounded-2xl border border-line-subtle bg-surface p-6 text-sm text-content-secondary">
        You don&apos;t have permission to view payment records.
      </div>
    );
  }

  const [orders, transactions] = await Promise.all([
    paymentRepository.listOrders(),
    paymentRepository.listTransactions(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Razorpay orders & transactions" title="Payments" />

      <section className="space-y-3" aria-labelledby="payments-orders-heading">
        <div id="payments-orders-heading">
          <AdminSectionHeading>Orders</AdminSectionHeading>
        </div>
        <div tabIndex={0} role="region" aria-label="Payments table (scrollable)" className={adminTable.shell}>
          <table className={adminTable.table}>
            <thead className={adminTable.head}>
              <tr>
                <th className={adminTable.th}>Order ID</th>
                <th className={adminTable.th}>Plan</th>
                <th className={adminTable.th}>Amount (₹)</th>
                <th className={adminTable.th}>Status</th>
                <th className={adminTable.th}>Lead ref</th>
                <th className={adminTable.th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className={adminTable.row}>
                  <td className={adminTable.mono}>{order.id}</td>
                  <td className={`${adminTable.td} capitalize`}>{order.planId}</td>
                  <td className={`${adminTable.td} font-medium tabular-nums`}>
                    ₹{Number(order.amountINR).toLocaleString("en-IN")}
                  </td>
                  <td className={adminTable.td}>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className={adminTable.mono}>{order.leadReferenceCode || "—"}</td>
                  <td className={`${adminTable.td} text-content-secondary`}>
                    {new Date(order.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <EmptyTableState
              title="No orders recorded yet"
              description="Razorpay subscription payment orders will appear here once initiated."
            />
          )}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="payments-transactions-heading">
        <div id="payments-transactions-heading">
          <AdminSectionHeading>Transactions</AdminSectionHeading>
        </div>
        <div tabIndex={0} role="region" aria-label="Payment records table (scrollable)" className={adminTable.shell}>
          <table className={adminTable.table}>
            <thead className={adminTable.head}>
              <tr>
                <th className={adminTable.th}>Payment ID</th>
                <th className={adminTable.th}>Order ID</th>
                <th className={adminTable.th}>Amount (₹)</th>
                <th className={adminTable.th}>Status</th>
                <th className={adminTable.th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className={adminTable.row}>
                  <td className={adminTable.mono}>{tx.id}</td>
                  <td className={adminTable.mono}>{tx.orderId}</td>
                  <td className={`${adminTable.td} font-medium tabular-nums`}>
                    ₹{(tx.amountPaise / 100).toLocaleString("en-IN")}
                  </td>
                  <td className={adminTable.td}>
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className={`${adminTable.td} text-content-secondary`}>
                    {new Date(tx.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <EmptyTableState
              title="No transactions recorded yet"
              description="Captured webhook and verification transactions will show here."
            />
          )}
        </div>
      </section>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Admin Payments",
};
