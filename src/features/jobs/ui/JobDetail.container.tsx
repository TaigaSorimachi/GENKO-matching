"use client";

import { useJob } from "@/features/jobs/hooks/useJob";
import {
  useApplications,
  useApplyToJob,
} from "@/features/matches/hooks/useApplications";
import { JobDetailView } from "@/features/jobs/ui/JobDetail.view";
import { toast } from "sonner";

type JobDetailContainerProps = {
  jobId: string;
};

export function JobDetailContainer({ jobId }: JobDetailContainerProps) {
  const { data: job, isLoading } = useJob(jobId);
  const { data: applications } = useApplications();
  const applyMutation = useApplyToJob();

  const hasApplied =
    applications?.some((app) => app.jobId === jobId) ?? false;

  const handleApply = () => {
    applyMutation.mutate(jobId, {
      onSuccess: () => {
        toast.success("応募が完了しました");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <JobDetailView
      job={job ?? null}
      isLoading={isLoading}
      onApply={handleApply}
      isApplying={applyMutation.isPending}
      hasApplied={hasApplied}
    />
  );
}
