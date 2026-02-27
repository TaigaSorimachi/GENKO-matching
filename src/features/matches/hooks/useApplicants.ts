import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApplicants } from "@/features/jobs/api/job.api";
import { updateMatchStatus } from "@/features/matches/api/match.api";
import type { MatchStatus } from "@/lib/types/api";

export function useApplicants(jobId: string) {
  return useQuery({
    queryKey: ["applicants", jobId],
    queryFn: () => getApplicants(jobId),
    enabled: !!jobId,
  });
}

export function useUpdateMatchStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ matchId, status }: { matchId: string; status: MatchStatus }) =>
      updateMatchStatus(matchId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
