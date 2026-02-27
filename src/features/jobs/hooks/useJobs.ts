"use client";

import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/features/jobs/api/job.api";
import { useAuthStore } from "@/lib/stores/auth.store";

export function useJobs(filters?: {
  shiftType?: string;
  industry?: string;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
}) {
  const { currentUser } = useAuthStore();
  return useQuery({
    queryKey: ["jobs", currentUser?.id, filters],
    queryFn: () => getJobs({ userId: currentUser?.id, ...filters }),
    enabled: !!currentUser?.id,
  });
}
