"use client";

import { useAuth } from "@/lib/auth/client";
import { adminButton } from "@/components/admin/admin-ui";

export function AdminSignOutButton() {
  const { logout } = useAuth();
  return (
    <button type="button" onClick={() => logout()} className={adminButton("secondary", "sm")}>
      Sign out
    </button>
  );
}
