import { hasPermission } from "@/lib/clerk-auth";
import { StaffClient } from "./staff-client";

export default async function AdminStaffPage() {
  const canManage = await hasPermission("staff:manage");
  if (!canManage) {
    return (
      <div className="rounded-2xl border border-line-subtle bg-surface p-6 text-sm text-content-secondary">
        You don&apos;t have permission to manage staff roles.
      </div>
    );
  }

  return <StaffClient />;
}
