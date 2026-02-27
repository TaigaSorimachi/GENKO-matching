"use client";

import { useState } from "react";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { JobSearchView } from "@/features/jobs/ui/JobSearch.view";
import type { JobFilters } from "@/features/jobs/ui/JobFilter.view";

export function JobSearchContainer() {
  const [filters, setFilters] = useState<JobFilters>({});
  const { data: jobs, isLoading } = useJobs(filters);

  return (
    <JobSearchView
      jobs={jobs ?? []}
      isLoading={isLoading}
      filters={filters}
      onFilterChange={setFilters}
    />
  );
}
