type ConversationItem = {
  partnerId: string;
  partnerName: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
};

export function createMockConversation(
  overrides: Partial<ConversationItem> = {},
): ConversationItem {
  return {
    partnerId: "partner-1",
    partnerName: "田中太郎",
    lastMessage: "明日の勤務よろしくお願いします",
    lastMessageAt: new Date("2026-03-01T10:00:00"),
    unreadCount: 0,
    ...overrides,
  };
}
