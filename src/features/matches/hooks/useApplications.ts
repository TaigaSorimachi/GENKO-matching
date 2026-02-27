"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApplications, applyToJob } from "@/features/matches/api/match.api";
import { useAuthStore } from "@/lib/stores/auth.store";
import type { MatchWithDetails } from "@/lib/types/api";

export function useApplications() {
  const { currentUser } = useAuthStore();
  return useQuery<MatchWithDetails[]>({
    queryKey: ["applications", currentUser?.id],
    queryFn: () => getApplications(currentUser!.id),
    enabled: !!currentUser?.id,
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  return useMutation({
    mutationFn: (jobId: string) => applyToJob(currentUser!.id, jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
