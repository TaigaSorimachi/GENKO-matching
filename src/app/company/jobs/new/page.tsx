"use client";

import { useAuthStore } from "@/lib/stores/auth.store";
import { JobForm } from "@/features/jobs/ui/job-form";

export default function CreateJobPage() {
  const { currentUser } = useAuthStore();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        ユーザーを選択してください
      </div>
    );
  }

  return <JobForm mode="create" />;
}
