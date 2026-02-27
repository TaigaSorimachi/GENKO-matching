"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type ConversationItem = {
  partnerId: string;
  partnerName: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
};

type ConversationListViewProps = {
  conversations: ConversationItem[];
  isLoading: boolean;
  basePath: string;
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "たった今";
  if (diffMinutes < 60) return `${diffMinutes}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  return target.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

function ConversationAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
      {name.charAt(0)}
    </div>
  );
}

function ConversationItemRow({
  conversation,
  basePath,
}: {
  conversation: ConversationItem;
  basePath: string;
}) {
  return (
    <Link
      href={`${basePath}/${conversation.partnerId}`}
      className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-50 active:bg-gray-100"
    >
      <ConversationAvatar name={conversation.partnerName} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="truncate font-medium text-gray-900">
            {conversation.partnerName}
          </span>
          <span className="shrink-0 text-xs text-gray-400">
            {formatTimeAgo(conversation.lastMessageAt)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="truncate text-sm text-gray-500">
            {conversation.lastMessage}
          </p>
          {conversation.unreadCount > 0 && (
            <Badge className="ml-2 shrink-0 rounded-full bg-blue-600 px-2 text-xs text-white hover:bg-blue-600">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-3 text-4xl">💬</div>
      <p className="text-gray-500">まだメッセージはありません</p>
      <p className="mt-1 text-sm text-gray-400">
        マッチングした相手とチャットできます
      </p>
    </div>
  );
}

export function ConversationListView({
  conversations,
  isLoading,
  basePath,
}: ConversationListViewProps) {
  if (isLoading) {
    return (
      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, i) => (
          <ConversationSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => (
        <ConversationItemRow
          key={conversation.partnerId}
          conversation={conversation}
          basePath={basePath}
        />
      ))}
    </div>
  );
}
