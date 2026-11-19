"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/client";
import { User, LogOut, LayoutDashboard, Settings } from "lucide-react";

export function UserNav() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!user) return null;

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : user.email.substring(0, 2).toUpperCase();


  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User account menu"
        className="group w-11 h-11 -m-1.5 rounded-full flex items-center justify-center focus:outline-none"
      >
        <span className="w-8 h-8 rounded-full bg-forest-900 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-line-subtle group-hover:ring-brand-primary group-focus-visible:ring-brand-primary transition-all">
          {initials || <User className="w-4 h-4" aria-hidden="true" />}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E2ECE4] shadow-floating py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-4 py-2 border-b border-line-subtle/70">
            <p className="text-xs font-bold text-forest-950 truncate">
              {user.fullName}
            </p>
            <p className="text-[11px] text-content-muted truncate">
              {user.email}
            </p>
            {user.role !== "customer" && (
              <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-forest-50 text-forest-800 rounded">
                {user.role}
              </span>
            )}
          </div>

          <div className="py-1">
            <Link
              href="/dashboard/overview"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-forest-950 hover:bg-forest-50 hover:text-brand-primary transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-content-muted" />
              <span>Subscriber Dashboard</span>
            </Link>

            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-forest-950 hover:bg-forest-50 hover:text-brand-primary transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-content-muted" />
              <span>Settings & Profile</span>
            </Link>
          </div>

          <div className="pt-1 border-t border-line-subtle/70">
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
