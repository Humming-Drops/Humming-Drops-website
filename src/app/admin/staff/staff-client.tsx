"use client";

import { useEffect, useState } from "react";

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
    return <div className="rounded-2xl border border-line-subtle bg-surface p-6 text-sm text-content-secondary">Loading…</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-content-secondary">PostgreSQL RBAC grants</p>
        <h2 className="font-display text-3xl font-extrabold text-content-primary">Staff &amp; roles</h2>
      </div>

      {actionError && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">{actionError}</div>}

      <form onSubmit={assignRole} className="flex flex-wrap items-end gap-3 rounded-2xl border border-line-subtle bg-surface p-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-content-secondary">Registered user email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-stone-300 px-3 py-2 text-sm"
            placeholder="name@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-content-secondary">Role</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="rounded-xl border border-stone-300 px-3 py-2 text-sm"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !email || !roleId}
          className="rounded-full bg-brand-primary px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Assigning…" : "Assign role"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line-subtle text-xs text-content-secondary">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Legacy role</th>
              <th className="px-4 py-3">RBAC grants</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(({ user, roles: grants }) => (
              <tr key={user.id} className="border-b border-line-subtle last:border-0">
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 text-content-secondary">{user.phone}</td>
                <td className="px-4 py-3 text-content-secondary">{user.role}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {grants.length === 0 && <span className="text-content-secondary">None</span>}
                    {grants.map((g) => (
                      <span
                        key={g.roleId}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line-subtle px-2.5 py-0.5 text-xs"
                      >
                        {g.roleName}
                        <button
                          type="button"
                          disabled={busyKey === `${user.id}:${g.roleId}`}
                          onClick={() => revokeRole(user.id, g.roleId)}
                          className="text-content-secondary hover:text-red-700"
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
        {staff.length === 0 && <p className="p-6 text-sm text-content-secondary">No staff accounts yet.</p>}
      </div>
    </div>
  );
}
