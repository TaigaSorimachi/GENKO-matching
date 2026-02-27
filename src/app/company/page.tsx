"use client";

import { useAuthStore } from "@/lib/stores/auth.store";
import { Dashboard } from "@/features/companies/ui/dashboard";

export default function CompanyDashboardPage() {
  const { currentUser } = useAuthStore();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        ユーザーを選択してください
      </div>
    );
  }

  return <Dashboard />;
}
