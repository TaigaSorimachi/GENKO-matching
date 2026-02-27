"use client";

import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/features/messages/api/message.api";
import { useAuthStore } from "@/lib/stores/auth.store";
import type { Conversation } from "@/lib/types/api";

export function useConversations() {
  const { currentUser } = useAuthStore();
  return useQuery<Conversation[]>({
    queryKey: ["conversations", currentUser?.id],
    queryFn: () => getConversations(currentUser!.id),
    enabled: !!currentUser?.id,
    refetchInterval: 5000,
  });
}
