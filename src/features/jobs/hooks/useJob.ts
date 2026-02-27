"use client";

import { useQuery } from "@tanstack/react-query";
import { getJob } from "@/features/jobs/api/job.api";

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJob(id),
    enabled: !!id,
  });
}
