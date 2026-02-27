import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJobs, getJob, createJob, updateJob, deleteJob } from "@/features/jobs/api/job.api";
import { useAuthStore } from "@/lib/stores/auth.store";
import type { CreateJobRequest, UpdateJobRequest } from "@/lib/types/api";

export function useCompanyJobs(status?: string) {
  const { currentUser } = useAuthStore();
  return useQuery({
    queryKey: ["companyJobs", currentUser?.companyId, status],
    queryFn: () =>
      getJobs({
        companyId: currentUser?.companyId,
        ...(status ? { status } : {}),
      }),
    enabled: !!currentUser?.companyId,
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJob(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobRequest) => createJob(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companyJobs"] }),
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobRequest }) => updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyJobs"] });
      queryClient.invalidateQueries({ queryKey: ["job"] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companyJobs"] }),
  });
}
