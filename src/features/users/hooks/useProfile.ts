"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, updateUser } from "@/features/users/api/user.api";
import { useAuthStore } from "@/lib/stores/auth.store";

export function useProfile() {
  const { currentUser } = useAuthStore();
  return useQuery({
    queryKey: ["user", currentUser?.id],
    queryFn: () => getUser(currentUser!.id),
    enabled: !!currentUser?.id,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  return useMutation({
    mutationFn: (data: {
      name?: string;
      phone?: string;
      location?: string;
      language?: string;
    }) => updateUser(currentUser!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
