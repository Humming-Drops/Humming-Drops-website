import { hasPermission } from "@/lib/clerk-auth";
import { paymentRepository } from "@/lib/payment-storage";

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
    <div className="space-y-8">
      <div>
        <p className="text-sm text-content-secondary">Razorpay orders &amp; transactions</p>
        <h2 className="font-display text-3xl font-extrabold text-content-primary">Payments</h2>
      </div>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-content-secondary">Orders</h3>
        <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line-subtle text-xs text-content-secondary">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Amount (₹)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Lead ref</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-line-subtle last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                  <td className="px-4 py-3">{order.planId}</td>
                  <td className="px-4 py-3">{order.amountINR}</td>
                  <td className="px-4 py-3">{order.status}</td>
                  <td className="px-4 py-3 font-mono text-xs">{order.leadReferenceCode || "—"}</td>
                  <td className="px-4 py-3 text-content-secondary">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="p-6 text-sm text-content-secondary">No orders recorded yet.</p>}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-content-secondary">Transactions</h3>
        <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line-subtle text-xs text-content-secondary">
              <tr>
                <th className="px-4 py-3">Payment ID</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Amount (paise)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-line-subtle last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{tx.id}</td>
                  <td className="px-4 py-3 font-mono text-xs">{tx.orderId}</td>
                  <td className="px-4 py-3">{tx.amountPaise}</td>
                  <td className="px-4 py-3">{tx.status}</td>
                  <td className="px-4 py-3 text-content-secondary">
                    {new Date(tx.createdAt).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <p className="p-6 text-sm text-content-secondary">No transactions recorded yet.</p>
          )}
        </div>
      </section>

      <p className="text-xs text-content-secondary">
        Payment records are currently file-backed pending the production PostgreSQL migration tracked under
        RR-006. This view reads through the same repository the payment API routes already use, so no
        admin-UI change is needed once that migration lands.
      </p>
    </div>
  );
}
