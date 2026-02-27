"use client";

import { useAuthStore } from "@/lib/stores/auth.store";
import { JobManagement } from "@/features/jobs/ui/job-management";

export default function CompanyJobsPage() {
  const { currentUser } = useAuthStore();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        ユーザーを選択してください
      </div>
    );
  }

  return <JobManagement />;
}
