import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Subscribe | Morning Breakfast Box | Humming Drops",
  description: "Start your daily fresh 5-compartment breakfast box subscription in Bangalore.",
};

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
