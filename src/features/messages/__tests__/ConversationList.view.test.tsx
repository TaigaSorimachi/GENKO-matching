import { render, screen } from "@testing-library/react";
import { ConversationListView } from "../ui/ConversationList.view";
import { createMockConversation } from "./factories/messages.factory";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe("ConversationListView", () => {
  it("ローディング中はSkeletonを表示する", () => {
    const { container } = render(
      <ConversationListView conversations={[]} isLoading={true} basePath="/messages" />,
    );

    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThan(0);
  });

  it("会話がない場合は空状態メッセージを表示する", () => {
    render(
      <ConversationListView conversations={[]} isLoading={false} basePath="/messages" />,
    );

    expect(screen.getByText("まだメッセージはありません")).toBeInTheDocument();
    expect(screen.getByText("マッチングした相手とチャットできます")).toBeInTheDocument();
  });

  it("会話一覧を相手名・最終メッセージ付きで表示する", () => {
    const conversations = [
      createMockConversation({
        partnerId: "p-1",
        partnerName: "田中太郎",
        lastMessage: "明日の勤務よろしくお願いします",
      }),
      createMockConversation({
        partnerId: "p-2",
        partnerName: "鈴木花子",
        lastMessage: "了解しました",
      }),
    ];

    render(
      <ConversationListView conversations={conversations} isLoading={false} basePath="/messages" />,
    );

    expect(screen.getByText("田中太郎")).toBeInTheDocument();
    expect(screen.getByText("明日の勤務よろしくお願いします")).toBeInTheDocument();
    expect(screen.getByText("鈴木花子")).toBeInTheDocument();
    expect(screen.getByText("了解しました")).toBeInTheDocument();
  });

  it("未読数がある場合はバッジを表示する", () => {
    const conversations = [createMockConversation({ unreadCount: 3 })];

    render(
      <ConversationListView conversations={conversations} isLoading={false} basePath="/messages" />,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("会話アイテムのリンクが正しいパスを持つ", () => {
    const conversations = [createMockConversation({ partnerId: "p-1" })];

    render(
      <ConversationListView conversations={conversations} isLoading={false} basePath="/messages" />,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/messages/p-1");
  });
});
