import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isStaffUser } from "@/lib/auth/server";
import { AdminSignInPortal } from "@/components/auth/admin-sign-in-portal";

export const metadata: Metadata = {
  title: "Admin Portal Sign In",
  description: "Operations console sign in for Humming Drops staff and administrators.",
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isStaffUser()) {
    redirect("/admin");
  }

  return <AdminSignInPortal />;
}
