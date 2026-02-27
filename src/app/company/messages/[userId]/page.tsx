"use client";

import { useParams } from "next/navigation";
import { ChatRoom } from "@/features/messages/ui/messages";

export default function CompanyChatPage() {
  const params = useParams();
  const userId = params.userId as string;

  if (!userId) {
    return null;
  }

  return <ChatRoom partnerId={userId} />;
}
