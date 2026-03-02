import { render, screen } from "@testing-library/react";
import { JobCardView } from "../ui/JobCard.view";
import { createMockJob, createMockJobSkill } from "./factories/jobs.factory";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe("JobCardView", () => {
  it("求人タイトル・企業名・給与を表示する", () => {
    const job = createMockJob({
      title: "配送ドライバー",
      salaryMin: 12000,
      salaryMax: 18000,
      company: {
        ...createMockJob().company,
        name: "物流ABC株式会社",
      },
    });

    render(<JobCardView job={job} />);

    expect(screen.getByText("配送ドライバー")).toBeInTheDocument();
    expect(screen.getByText("物流ABC株式会社")).toBeInTheDocument();
    expect(screen.getByText("¥12,000〜¥18,000/日")).toBeInTheDocument();
  });

  it("マッチスコアバッジを表示する", () => {
    const job = createMockJob({ matchScore: 87.4 });

    render(<JobCardView job={job} />);

    expect(screen.getByText("87%マッチ")).toBeInTheDocument();
  });

  it("マッチスコアがない場合はバッジを表示しない", () => {
    const job = createMockJob({ matchScore: undefined });

    render(<JobCardView job={job} />);

    expect(screen.queryByText(/マッチ/)).not.toBeInTheDocument();
  });

  it.each([
    { urgency: "EMERGENCY" as const, expected: "緊急" },
    { urgency: "URGENT" as const, expected: "急募" },
  ])("緊急度が$urgencyの場合「$expected」バッジを表示する", ({ urgency, expected }) => {
    const job = createMockJob({ urgency });

    render(<JobCardView job={job} />);

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("NORMALの場合は緊急バッジを表示しない", () => {
    const job = createMockJob({ urgency: "NORMAL" });

    render(<JobCardView job={job} />);

    expect(screen.queryByText("緊急")).not.toBeInTheDocument();
    expect(screen.queryByText("急募")).not.toBeInTheDocument();
  });

  it("スキルバッジを表示する", () => {
    const job = createMockJob({
      skills: [
        createMockJobSkill({ skillId: "s1", skill: { ...createMockJobSkill().skill, id: "s1", name: "フォークリフト" } }),
        createMockJobSkill({ skillId: "s2", skill: { ...createMockJobSkill().skill, id: "s2", name: "玉掛け" } }),
      ],
    });

    render(<JobCardView job={job} />);

    expect(screen.getByText("フォークリフト")).toBeInTheDocument();
    expect(screen.getByText("玉掛け")).toBeInTheDocument();
  });
});
