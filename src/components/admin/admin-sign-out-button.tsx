"use client";

import { useAuth } from "@/lib/auth/client";

export function AdminSignOutButton() {
  const { logout } = useAuth();
  return (
    <button
      type="button"
      onClick={() => logout()}
      className="rounded-full border border-line-subtle bg-surface px-3 py-1.5 min-h-[32px] text-xs font-semibold text-content-secondary hover:bg-muted/40 hover:text-content-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      Sign out
    </button>
  );
}
