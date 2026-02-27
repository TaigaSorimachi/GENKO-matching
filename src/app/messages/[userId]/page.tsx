"use client";

import { useParams } from "next/navigation";
import { ChatRoom } from "@/features/messages/ui/messages";
import { BottomNav } from "@/components/bottom-nav";

export default function ChatPage() {
  const params = useParams();
  const userId = params.userId as string;

  if (!userId) {
    return null;
  }

  return (
    <>
      <ChatRoom partnerId={userId} />
      <BottomNav />
    </>
  );
}
