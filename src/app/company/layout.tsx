"use client";

import { SidebarNav } from "@/components/sidebar-nav";
import { useAuthStore } from "@/lib/stores/auth.store";
import { redirect } from "next/navigation";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuthStore();

  if (currentUser && currentUser.type !== "EMPLOYER") {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <SidebarNav />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
