"use client";

import { ConversationList } from "@/features/messages/ui/messages";

export default function CompanyMessagesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold">チャット</h1>
      <ConversationList />
    </main>
  );
}
