"use client";

import { ConversationList } from "@/features/messages/ui/messages";
import { BottomNav } from "@/components/bottom-nav";

export default function MessagesPage() {
  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6">
        <h1 className="mb-4 text-xl font-bold">チャット</h1>
        <ConversationList />
      </main>
      <BottomNav />
    </>
  );
}
