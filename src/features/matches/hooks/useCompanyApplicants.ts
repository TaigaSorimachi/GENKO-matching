import { useQuery } from "@tanstack/react-query";
import { getCompanyApplicants } from "@/features/matches/api/match.api";
import { useAuthStore } from "@/lib/stores/auth.store";
import type { MatchWithDetails } from "@/lib/types/api";

export function useCompanyApplicants() {
  const { currentUser } = useAuthStore();
  const companyId = currentUser?.companyId;
  return useQuery<MatchWithDetails[]>({
    queryKey: ["companyApplicants", companyId],
    queryFn: () => getCompanyApplicants(companyId!),
    enabled: !!companyId,
  });
}
