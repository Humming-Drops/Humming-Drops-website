"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { EmptyTableState } from "@/components/admin/status-badge";
import { AdminDialog } from "@/components/admin/admin-dialog";
import {
  AdminLoadingState,
  AdminNotice,
  AdminPageHeader,
  adminButton,
  adminCard,
  adminInput,
  adminLabel,
  adminTable,
} from "@/components/admin/admin-ui";

interface RoleGrant {
  roleId: string;
  roleSlug: string;
  roleName: string;
}

interface StaffRow {
  user: { id: string; email: string; phone: string; role: string };
  roles: RoleGrant[];
}

interface RoleOption {
  id: string;
  slug: string;
  name: string;
}

export function StaffClient() {
  const [staff, setStaff] = useState<StaffRow[] | null>(null);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const load = () => {
    Promise.all([
      fetch("/api/admin/staff").then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || "Failed to load staff.");
        return res.json();
      }),
      fetch("/api/admin/staff/roles").then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || "Failed to load roles.");
        return res.json();
      }),
    ])
      .then(([staffJson, rolesJson]) => {
        setStaff(staffJson.staff);
        setRoles(rolesJson.roles);
        if (rolesJson.roles?.length > 0) setRoleId((prev) => prev || rolesJson.roles[0].id);
      })
      .catch((err) => setLoadError(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  const assignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, roleId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setActionError(json.error || "Failed to assign role.");
        return;
      }
      setEmail("");
      load();
    } catch {
      setActionError("Network error assigning the role.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [revokeTarget, setRevokeTarget] = useState<{ userId: string; email: string; grant: RoleGrant } | null>(null);
  const [revokeError, setRevokeError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const revokeRole = async (userId: string, targetRoleId: string) => {
    const key = `${userId}:${targetRoleId}`;
    setActionError(null);
    setRevokeError(null);
    setNotice(null);
    setBusyKey(key);
    try {
      const res = await fetch(`/api/admin/staff/${userId}/roles/${targetRoleId}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRevokeError(json.error || "Failed to revoke role.");
        return;
      }
      setNotice(revokeTarget ? `${revokeTarget.grant.roleName} removed from ${revokeTarget.email}.` : "Role removed.");
      setRevokeTarget(null);
      load();
    } catch {
      setRevokeError("Network error revoking the role.");
    } finally {
      setBusyKey(null);
    }
  };

  if (loadError) {
    return <AdminNotice tone="error">{loadError}</AdminNotice>;
  }
  if (!staff) {
    return <AdminLoadingState label="Loading staff roles" />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Roles granted to each staff member" title="Staff & roles" />

      {actionError && (
        <AdminNotice tone="error">{actionError}</AdminNotice>
      )}
      {notice && <AdminNotice tone="success">{notice}</AdminNotice>}

      <form
        onSubmit={assignRole}
        className={`${adminCard} grid grid-cols-1 items-end gap-3 p-4 sm:p-5 lg:grid-cols-12`}
      >
        <div className="space-y-1.5 lg:col-span-6">
          <label htmlFor="staff-email" className={adminLabel}>
            Registered user email
          </label>
          <input
            id="staff-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={adminInput}
            placeholder="name@example.com"
          />
        </div>
        <div className="space-y-1.5 lg:col-span-4">
          <label htmlFor="staff-role" className={adminLabel}>
            Role
          </label>
          <select
            id="staff-role"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className={adminInput}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting || !email || !roleId}
            className={adminButton("primary", "md", "w-full")}
          >
            {isSubmitting ? "Assigning…" : "Assign role"}
          </button>
        </div>
      </form>

      <div tabIndex={0} role="region" aria-label="Staff table (scrollable)" className={adminTable.shell}>
        <table className={adminTable.table}>
          <thead className={adminTable.head}>
            <tr>
              <th className={adminTable.th}>Email</th>
              <th className={adminTable.th}>Phone</th>
              <th className={adminTable.th}>Account type</th>
              <th className={adminTable.th}>Granted roles</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(({ user, roles: grants }) => (
              <tr key={user.id} className={adminTable.row}>
                <td className={`${adminTable.td} font-medium text-content-primary`}>{user.email}</td>
                <td className={`${adminTable.td} text-content-secondary`}>{user.phone || "—"}</td>
                <td className={`${adminTable.td} text-content-secondary`}>{user.role.replace(/_/g, " ")}</td>
                <td className={adminTable.td}>
                  <div className="flex flex-wrap gap-2">
                    {grants.length === 0 && <span className="text-content-secondary">None</span>}
                    {grants.map((g) => (
                      <span
                        key={g.roleId}
                        className="inline-flex items-center gap-1 rounded-full border border-line-subtle bg-muted/30 py-0.5 pl-2.5 pr-0.5 text-xs font-medium"
                      >
                        {g.roleName}
                        <button
                          type="button"
                          disabled={busyKey === `${user.id}:${g.roleId}`}
                          onClick={() => {
                            setRevokeError(null);
                            setRevokeTarget({ userId: user.id, email: user.email, grant: g });
                          }}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-content-secondary hover:bg-red-100 hover:text-red-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                          aria-label={`Revoke ${g.roleName}`}
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {staff.length === 0 && (
          <EmptyTableState
            title="No staff accounts yet"
            description="Assign a role to a registered user email above to grant admin access."
          />
        )}
      </div>

      <AdminDialog
        open={revokeTarget !== null}
        title={revokeTarget ? `Remove ${revokeTarget.grant.roleName}?` : "Remove role"}
        description={
          revokeTarget ? (
            <>
              <strong className="text-content-primary">{revokeTarget.email}</strong> will lose the permissions that come
              with {revokeTarget.grant.roleName}. You can grant it again later.
            </>
          ) : null
        }
        onClose={() => setRevokeTarget(null)}
        footer={
          <>
            <button type="button" onClick={() => setRevokeTarget(null)} className={adminButton("secondary")}>
              Keep role
            </button>
            <button
              type="button"
              disabled={!revokeTarget || busyKey !== null}
              onClick={() => revokeTarget && revokeRole(revokeTarget.userId, revokeTarget.grant.roleId)}
              className={adminButton("danger")}
            >
              Remove role
            </button>
          </>
        }
      >
        {revokeError && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {revokeError}
          </p>
        )}
      </AdminDialog>
    </div>
  );
}
