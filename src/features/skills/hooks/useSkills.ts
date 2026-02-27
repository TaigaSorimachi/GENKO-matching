"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSkills } from "@/features/skills/api/skill.api";
import {
  addUserSkill,
  updateUserSkill,
  removeUserSkill,
} from "@/features/users/api/user.api";
import { useAuthStore } from "@/lib/stores/auth.store";

export function useSkillMaster() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: () => getSkills(),
  });
}

export function useAddSkill() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  return useMutation({
    mutationFn: ({ skillId, level }: { skillId: string; level: number }) =>
      addUserSkill(currentUser!.id, skillId, level),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  return useMutation({
    mutationFn: ({ skillId, level }: { skillId: string; level: number }) =>
      updateUserSkill(currentUser!.id, skillId, level),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });
}

export function useRemoveSkill() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  return useMutation({
    mutationFn: (skillId: string) =>
      removeUserSkill(currentUser!.id, skillId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });
}
