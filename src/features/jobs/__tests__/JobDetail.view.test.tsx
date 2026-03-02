import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JobDetailView } from "../ui/JobDetail.view";
import { createMockJob, createMockJobSkill } from "./factories/jobs.factory";

function createDefaultProps(overrides: Partial<Parameters<typeof JobDetailView>[0]> = {}) {
  return {
    job: createMockJob(),
    isLoading: false,
    onApply: vi.fn(),
    isApplying: false,
    hasApplied: false,
    ...overrides,
  };
}

describe("JobDetailView", () => {
  it("ローディング中はSkeletonを表示する", () => {
    const props = createDefaultProps({ isLoading: true });

    const { container } = render(<JobDetailView {...props} />);

    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThan(0);
  });

  it("求人がnullの場合は「見つかりません」を表示する", () => {
    const props = createDefaultProps({ job: null });

    render(<JobDetailView {...props} />);

    expect(screen.getByText("求人が見つかりませんでした")).toBeInTheDocument();
  });

  it("求人詳細を正しく表示する", () => {
    const job = createMockJob({
      title: "警備スタッフ",
      description: "施設の巡回警備を担当します。",
      location: "大阪市北区",
      salaryMin: 11000,
      salaryMax: 14000,
      company: {
        ...createMockJob().company,
        name: "セキュリティ株式会社",
        industry: "SECURITY",
      },
    });
    const props = createDefaultProps({ job });

    render(<JobDetailView {...props} />);

    expect(screen.getByText("警備スタッフ")).toBeInTheDocument();
    expect(screen.getByText("セキュリティ株式会社")).toBeInTheDocument();
    expect(screen.getByText("¥11,000〜¥14,000/日")).toBeInTheDocument();
    expect(screen.getByText("大阪市北区")).toBeInTheDocument();
    expect(screen.getByText("施設の巡回警備を担当します。")).toBeInTheDocument();
    expect(screen.getByText("警備")).toBeInTheDocument();
  });

  it("応募ボタンをクリックするとonApplyが呼ばれる", async () => {
    const user = userEvent.setup();
    const props = createDefaultProps();

    render(<JobDetailView {...props} />);

    await user.click(screen.getByRole("button", { name: "応募する" }));

    expect(props.onApply).toHaveBeenCalledOnce();
  });

  it("応募済みの場合は「応募済み」ボタンを表示する", () => {
    const props = createDefaultProps({ hasApplied: true });

    render(<JobDetailView {...props} />);

    const button = screen.getByRole("button", { name: "応募済み" });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("応募中の場合はボタンが無効になる", () => {
    const props = createDefaultProps({ isApplying: true });

    render(<JobDetailView {...props} />);

    const button = screen.getByRole("button", { name: "応募中..." });
    expect(button).toBeDisabled();
  });
});
