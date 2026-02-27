"use client";

import type { RefObject } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type MessageItem = {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
  sender: { name: string };
};

type ChatRoomViewProps = {
  messages: MessageItem[];
  currentUserId: string;
  partnerName: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isSending: boolean;
  isLoading: boolean;
  backPath: string;
  bottomRef: RefObject<HTMLDivElement | null>;
};

function formatMessageTime(date: Date): string {
  const target = new Date(date);
  return target.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatHeader({
  partnerName,
  backPath,
}: {
  partnerName: string;
  backPath: string;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-white px-4 py-3">
      <Link
        href={backPath}
        className="flex items-center justify-center rounded-full p-1 transition-colors hover:bg-gray-100"
      >
        <ArrowLeft className="h-5 w-5 text-gray-600" />
      </Link>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
          {partnerName.charAt(0)}
        </div>
        <span className="font-medium text-gray-900">{partnerName}</span>
      </div>
    </div>
  );
}

function OwnMessageBubble({
  message,
}: {
  message: MessageItem;
}) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%]">
        <div className="rounded-2xl rounded-br-sm bg-blue-600 px-4 py-2 text-white">
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        </div>
        <p className="mt-1 text-right text-xs text-gray-400">
          {formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

function OtherMessageBubble({
  message,
}: {
  message: MessageItem;
}) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[75%]">
        <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2">
          <p className="whitespace-pre-wrap text-sm text-gray-900">
            {message.content}
          </p>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

function MessageList({
  messages,
  currentUserId,
  bottomRef,
}: {
  messages: MessageItem[];
  currentUserId: string;
  bottomRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="space-y-3">
        {messages.map((message) =>
          message.senderId === currentUserId ? (
            <OwnMessageBubble key={message.id} message={message} />
          ) : (
            <OtherMessageBubble key={message.id} message={message} />
          )
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function MessageInput({
  inputValue,
  onInputChange,
  onSend,
  onKeyDown,
  isSending,
}: {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isSending: boolean;
}) {
  return (
    <div className="sticky bottom-0 border-t bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="メッセージを入力..."
          className="flex-1 rounded-full"
          disabled={isSending}
        />
        <Button
          onClick={onSend}
          disabled={isSending || inputValue.trim() === ""}
          size="icon"
          className="shrink-0 rounded-full bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function MessagesSkeleton() {
  return (
    <div className="flex-1 space-y-4 px-4 py-4">
      <div className="flex justify-start">
        <Skeleton className="h-10 w-48 rounded-2xl" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-40 rounded-2xl" />
      </div>
      <div className="flex justify-start">
        <Skeleton className="h-10 w-56 rounded-2xl" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-36 rounded-2xl" />
      </div>
    </div>
  );
}

function EmptyMessages() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <p className="text-gray-500">まだメッセージはありません</p>
      <p className="mt-1 text-sm text-gray-400">
        最初のメッセージを送ってみましょう
      </p>
    </div>
  );
}

export function ChatRoomView({
  messages,
  currentUserId,
  partnerName,
  inputValue,
  onInputChange,
  onSend,
  onKeyDown,
  isSending,
  isLoading,
  backPath,
  bottomRef,
}: ChatRoomViewProps) {
  return (
    <div className="flex h-[100dvh] flex-col">
      <ChatHeader partnerName={partnerName} backPath={backPath} />

      {isLoading ? (
        <MessagesSkeleton />
      ) : messages.length === 0 ? (
        <EmptyMessages />
      ) : (
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          bottomRef={bottomRef}
        />
      )}

      <MessageInput
        inputValue={inputValue}
        onInputChange={onInputChange}
        onSend={onSend}
        onKeyDown={onKeyDown}
        isSending={isSending}
      />
    </div>
  );
}
