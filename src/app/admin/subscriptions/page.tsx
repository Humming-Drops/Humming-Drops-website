import { hasPermission } from "@/lib/clerk-auth";
import { SubscriptionsClient } from "./subscriptions-client";

export default async function AdminSubscriptionsPage() {
  const canManage = await hasPermission("subscriptions:manage");
  if (!canManage) {
    return (
      <div className="rounded-2xl border border-line-subtle bg-surface p-6 text-sm text-content-secondary">
        You don&apos;t have permission to manage subscriptions.
      </div>
    );
  }

  return <SubscriptionsClient />;
}
