import { render, screen } from "@testing-library/react";
import { ApplicationListView } from "../ui/ApplicationList.view";
import { createMockApplication } from "./factories/matches.factory";

describe("ApplicationListView", () => {
  it("ローディング中はSkeletonを表示する", () => {
    const { container } = render(
      <ApplicationListView applications={[]} isLoading={true} />,
    );

    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThan(0);
  });

  it("応募がない場合は空状態メッセージを表示する", () => {
    render(<ApplicationListView applications={[]} isLoading={false} />);

    expect(screen.getByText("応募履歴がありません")).toBeInTheDocument();
    expect(screen.getByText("求人を探して応募してみましょう")).toBeInTheDocument();
  });

  it("応募一覧を求人情報とステータス付きで表示する", () => {
    const applications = [
      createMockApplication({
        id: "m-1",
        status: "APPLIED",
        job: {
          ...createMockApplication().job,
          title: "倉庫内軽作業",
          company: { ...createMockApplication().job.company, name: "物流ABC" },
        },
      }),
      createMockApplication({
        id: "m-2",
        status: "INTERVIEW",
        job: {
          ...createMockApplication().job,
          title: "配送ドライバー",
          company: { ...createMockApplication().job.company, name: "運送XYZ" },
        },
      }),
    ];

    render(<ApplicationListView applications={applications} isLoading={false} />);

    expect(screen.getByText("倉庫内軽作業")).toBeInTheDocument();
    expect(screen.getByText("物流ABC")).toBeInTheDocument();
    expect(screen.getByText("応募中")).toBeInTheDocument();

    expect(screen.getByText("配送ドライバー")).toBeInTheDocument();
    expect(screen.getByText("運送XYZ")).toBeInTheDocument();
    expect(screen.getByText("面接")).toBeInTheDocument();
  });

  it("マッチスコアがある場合はスコアバッジを表示する", () => {
    const applications = [createMockApplication({ aiScore: 0.92 })];

    render(<ApplicationListView applications={applications} isLoading={false} />);

    expect(screen.getByText("92%マッチ")).toBeInTheDocument();
  });
});
