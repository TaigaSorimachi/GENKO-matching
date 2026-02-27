"use client";

import { useConversations } from "@/features/messages/hooks/useConversations";
import { useAuthStore } from "@/lib/stores/auth.store";
import { ConversationListView } from "./ConversationList.view";

export function ConversationListContainer() {
  const { currentUser } = useAuthStore();
  const { data: conversations, isLoading } = useConversations();

  const basePath =
    currentUser?.type === "EMPLOYER" ? "/company/messages" : "/messages";

  return (
    <ConversationListView
      conversations={conversations ?? []}
      isLoading={isLoading}
      basePath={basePath}
    />
  );
}
