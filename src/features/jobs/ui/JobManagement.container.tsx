"use client";

import { useCompanyJobs, useDeleteJob } from "@/features/jobs/hooks/useJobManagement";
import { JobManagementView } from "./JobManagement.view";
import { toast } from "sonner";

export function JobManagementContainer() {
  const { data: jobs, isLoading } = useCompanyJobs();
  const deleteJob = useDeleteJob();

  const handleDelete = (id: string) => {
    if (!confirm("この求人を削除しますか？")) return;
    deleteJob.mutate(id, {
      onSuccess: () => toast.success("求人を削除しました"),
      onError: () => toast.error("求人の削除に失敗しました"),
    });
  };

  return (
    <JobManagementView
      jobs={jobs ?? []}
      isLoading={isLoading}
      onDelete={handleDelete}
    />
  );
}
