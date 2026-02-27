"use client";

import { JobFilterView, type JobFilters } from "@/features/jobs/ui/JobFilter.view";
import { JobListView } from "@/features/jobs/ui/JobList.view";
import type { JobWithScore } from "@/lib/types/api";

type JobSearchViewProps = {
  jobs: JobWithScore[];
  isLoading: boolean;
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
};

export function JobSearchView({
  jobs,
  isLoading,
  filters,
  onFilterChange,
}: JobSearchViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">求人検索</h1>
        <JobFilterView filters={filters} onFilterChange={onFilterChange} />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-3">
          {isLoading ? "検索中..." : `${jobs.length}件の求人が見つかりました`}
        </p>
        <JobListView jobs={jobs} isLoading={isLoading} />
      </div>
    </div>
  );
}
