import { describe, it, expect } from "vitest";
import { createJobSchema, updateJobSchema } from "@/lib/validators/job.validator";

function createValidJobData(overrides?: Partial<Record<string, unknown>>) {
  return {
    companyId: "company-1",
    title: "フォークリフトオペレーター",
    description: "倉庫内でのフォークリフト作業",
    location: "東京都品川区",
    shiftType: "FULL_TIME",
    salaryMin: 250000,
    salaryMax: 350000,
    ...overrides,
  };
}

describe("createJobSchema", () => {
  it("有効なデータがバリデーションを通過する", () => {
    const result = createJobSchema.safeParse(createValidJobData());
    expect(result.success).toBe(true);
  });

  describe.each([
    ["titleが空文字", { title: "" }, "求人タイトルは必須です"],
    ["descriptionが空文字", { description: "" }, "求人の説明は必須です"],
    ["locationが空文字", { location: "" }, "勤務地は必須です"],
    ["shiftTypeが不正", { shiftType: "INVALID" }, undefined],
  ])("%s の場合バリデーションが失敗する", (_label, override, expectedMsg) => {
    it(`エラーを返す`, () => {
      const result = createJobSchema.safeParse(createValidJobData(override));
      expect(result.success).toBe(false);
      if (expectedMsg && !result.success) {
        const messages = result.error.issues.map((i) => i.message);
        expect(messages.some((m) => m.includes(expectedMsg))).toBe(true);
      }
    });
  });

  it("salaryMinがsalaryMaxより大きい場合エラーになる", () => {
    const result = createJobSchema.safeParse(
      createValidJobData({ salaryMin: 500000, salaryMax: 300000 })
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain("最低給与は最高給与以下にしてください");
    }
  });

  it("salaryMin <= salaryMaxの場合は通過する", () => {
    const result = createJobSchema.safeParse(
      createValidJobData({ salaryMin: 200000, salaryMax: 200000 })
    );
    expect(result.success).toBe(true);
  });

  it("skills配列が正しい形式で通過する", () => {
    const result = createJobSchema.safeParse(
      createValidJobData({ skills: [{ skillId: "s1", minLevel: 3 }] })
    );
    expect(result.success).toBe(true);
  });
});

describe("updateJobSchema", () => {
  it("部分的な更新データが通過する", () => {
    const result = updateJobSchema.safeParse({ title: "新しいタイトル" });
    expect(result.success).toBe(true);
  });

  it("空オブジェクトが通過する", () => {
    const result = updateJobSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("statusフィールドを受け付ける", () => {
    const result = updateJobSchema.safeParse({ status: "CLOSED" });
    expect(result.success).toBe(true);
  });
});
