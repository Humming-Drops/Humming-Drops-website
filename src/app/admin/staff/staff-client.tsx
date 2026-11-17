"use client";

import { useEffect, useState } from "react";
import { EmptyTableState } from "@/components/admin/status-badge";

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
      const json = await res.json();
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

  const revokeRole = async (userId: string, targetRoleId: string) => {
    const key = `${userId}:${targetRoleId}`;
    setActionError(null);
    setBusyKey(key);
    try {
      const res = await fetch(`/api/admin/staff/${userId}/roles/${targetRoleId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || "Failed to revoke role.");
        return;
      }
      load();
    } catch {
      setActionError("Network error revoking the role.");
    } finally {
      setBusyKey(null);
    }
  };

  if (loadError) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{loadError}</div>;
  }
  if (!staff) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading staff roles">
        <div className="space-y-2">
          <div className="h-4 w-36 rounded bg-muted/70" />
          <div className="h-8 w-44 rounded-xl bg-muted/70" />
        </div>
        <div className="h-24 rounded-2xl border border-line-subtle bg-surface" />
        <div className="h-56 rounded-2xl border border-line-subtle bg-surface" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-content-secondary">PostgreSQL RBAC grants</p>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-content-primary">Staff &amp; roles</h2>
      </div>

      {actionError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
          {actionError}
        </div>
      )}

      <form
        onSubmit={assignRole}
        className="grid grid-cols-1 sm:grid-cols-12 items-end gap-3 rounded-2xl border border-line-subtle bg-surface p-5 shadow-card"
      >
        <div className="sm:col-span-6 space-y-1.5">
          <label htmlFor="staff-email" className="block text-xs font-semibold text-content-secondary">
            Registered user email
          </label>
          <input
            id="staff-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-line-subtle px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            placeholder="name@example.com"
          />
        </div>
        <div className="sm:col-span-4 space-y-1.5">
          <label htmlFor="staff-role" className="block text-xs font-semibold text-content-secondary">
            Role
          </label>
          <select
            id="staff-role"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="w-full rounded-xl border border-line-subtle bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting || !email || !roleId}
            className="w-full rounded-full bg-brand-primary hover:bg-brand-hover px-5 py-2.5 min-h-[42px] text-xs font-semibold text-white disabled:opacity-60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
          >
            {isSubmitting ? "Assigning…" : "Assign role"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-surface shadow-card">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line-subtle bg-muted/40 text-xs font-semibold text-content-secondary">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Legacy role</th>
              <th className="px-4 py-3">RBAC grants</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(({ user, roles: grants }) => (
              <tr key={user.id} className="border-b border-line-subtle last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-content-primary">{user.email}</td>
                <td className="px-4 py-3 text-content-secondary whitespace-nowrap">{user.phone}</td>
                <td className="px-4 py-3 text-content-secondary">{user.role}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {grants.length === 0 && <span className="text-content-secondary">None</span>}
                    {grants.map((g) => (
                      <span
                        key={g.roleId}
                        className="inline-flex items-center gap-1 rounded-full border border-line-subtle bg-muted/30 px-2.5 py-0.5 text-xs font-medium"
                      >
                        {g.roleName}
                        <button
                          type="button"
                          disabled={busyKey === `${user.id}:${g.roleId}`}
                          onClick={() => revokeRole(user.id, g.roleId)}
                          className="w-5 h-5 inline-flex items-center justify-center rounded-full text-content-secondary hover:bg-red-100 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                          aria-label={`Revoke ${g.roleName}`}
                        >
                          ×
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
    </div>
  );
}
