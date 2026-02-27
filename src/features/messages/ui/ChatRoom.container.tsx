"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useMessages, useSendMessage } from "@/features/messages/hooks/useMessages";
import { useAuthStore } from "@/lib/stores/auth.store";
import { ChatRoomView } from "./ChatRoom.view";

type ChatRoomContainerProps = {
  partnerId: string;
};

export function ChatRoomContainer({ partnerId }: ChatRoomContainerProps) {
  const { currentUser } = useAuthStore();
  const { data: messages, isLoading } = useMessages(partnerId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const basePath =
    currentUser?.type === "EMPLOYER" ? "/company/messages" : "/messages";

  const partnerName =
    messages && messages.length > 0
      ? messages.find((m) => m.senderId === partnerId)?.sender?.name ?? "相手"
      : "相手";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || !currentUser) return;
    sendMessage(
      { receiverId: partnerId, content: trimmed },
      { onSuccess: () => setInputValue("") }
    );
  }, [inputValue, currentUser, partnerId, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (!currentUser) {
    return null;
  }

  return (
    <ChatRoomView
      messages={messages ?? []}
      currentUserId={currentUser.id}
      partnerName={partnerName}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSend={handleSend}
      onKeyDown={handleKeyDown}
      isSending={isSending}
      isLoading={isLoading}
      backPath={basePath}
      bottomRef={bottomRef}
    />
  );
}
