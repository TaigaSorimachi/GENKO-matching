"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "@/features/messages/api/message.api";
import { useAuthStore } from "@/lib/stores/auth.store";
import type { MessageWithSender } from "@/lib/types/api";

export function useMessages(partnerId: string) {
  const { currentUser } = useAuthStore();
  return useQuery<MessageWithSender[]>({
    queryKey: ["messages", currentUser?.id, partnerId],
    queryFn: () => getMessages(currentUser!.id, partnerId),
    enabled: !!currentUser?.id && !!partnerId,
    refetchInterval: 5000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  return useMutation({
    mutationFn: ({
      receiverId,
      content,
    }: {
      receiverId: string;
      content: string;
    }) => sendMessage(currentUser!.id, receiverId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
