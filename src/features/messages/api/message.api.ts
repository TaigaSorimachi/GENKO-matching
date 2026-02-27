import type { Conversation } from "@/lib/types/api";

export async function getConversations(userId: string): Promise<Conversation[]> {
  const res = await fetch(`/api/message?userId=${userId}`);
  if (!res.ok) throw new Error("会話一覧の取得に失敗しました");
  return res.json();
}

export async function getMessages(currentUserId: string, partnerId: string) {
  const res = await fetch(`/api/message/${partnerId}?currentUserId=${currentUserId}`);
  if (!res.ok) throw new Error("メッセージの取得に失敗しました");
  return res.json();
}

export async function sendMessage(senderId: string, receiverId: string, content: string) {
  const res = await fetch("/api/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senderId, receiverId, content }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? "メッセージの送信に失敗しました");
  }
  return res.json();
}
