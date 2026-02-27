"use client";

import { useJobs } from "@/features/jobs/hooks/useJobs";
import { JobListView } from "@/features/jobs/ui/JobList.view";

type JobListContainerProps = {
  limit?: number;
};

export function JobListContainer({ limit }: JobListContainerProps) {
  const { data: jobs, isLoading } = useJobs();

  const displayJobs = limit ? (jobs ?? []).slice(0, limit) : (jobs ?? []);

  return <JobListView jobs={displayJobs} isLoading={isLoading} />;
}
