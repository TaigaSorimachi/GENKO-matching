import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/features/companies/api/company.api";
import { useAuthStore } from "@/lib/stores/auth.store";

export function useDashboard() {
  const { currentUser } = useAuthStore();
  return useQuery({
    queryKey: ["dashboard", currentUser?.companyId],
    queryFn: () => getDashboard(currentUser!.companyId!),
    enabled: !!currentUser?.companyId,
  });
}
