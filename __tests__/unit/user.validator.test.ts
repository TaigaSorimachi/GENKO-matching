import { describe, it, expect } from "vitest";
import { createUserSchema, updateUserSchema } from "@/lib/validators/user.validator";

function createValidUserData(overrides?: Partial<Record<string, unknown>>) {
  return {
    type: "JOBSEEKER",
    phone: "090-1234-5678",
    name: "テスト太郎",
    ...overrides,
  };
}

describe("createUserSchema", () => {
  it("有効なデータがバリデーションを通過する", () => {
    const result = createUserSchema.safeParse(createValidUserData());
    expect(result.success).toBe(true);
  });

  it("全フィールドを指定した場合も通過する", () => {
    const result = createUserSchema.safeParse(
      createValidUserData({
        location: "東京都渋谷区",
        lat: 35.66,
        lng: 139.70,
        language: "ja",
        companyId: "company-1",
        industries: ["CONSTRUCTION", "MANUFACTURING"],
        skills: [{ skillId: "s1", level: 3 }],
      })
    );
    expect(result.success).toBe(true);
  });

  describe.each([
    ["電話番号にアルファベットが含まれる", { phone: "090-abcd-5678" }],
    ["電話番号に記号が含まれる", { phone: "090+1234+5678" }],
    ["電話番号が空文字", { phone: "" }],
  ])("%s の場合バリデーションが失敗する", (_label, override) => {
    it("エラーを返す", () => {
      const result = createUserSchema.safeParse(createValidUserData(override));
      expect(result.success).toBe(false);
    });
  });

  describe.each([
    ["ハイフン付き", { phone: "090-1234-5678" }],
    ["ハイフンなし", { phone: "09012345678" }],
  ])("電話番号が%sの場合は通過する", (_label, override) => {
    it("バリデーションを通過する", () => {
      const result = createUserSchema.safeParse(createValidUserData(override));
      expect(result.success).toBe(true);
    });
  });

  it("nameが空文字の場合エラーになる", () => {
    const result = createUserSchema.safeParse(createValidUserData({ name: "" }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain("名前は必須です");
    }
  });

  it("typeが不正な値の場合エラーになる", () => {
    const result = createUserSchema.safeParse(createValidUserData({ type: "INVALID" }));
    expect(result.success).toBe(false);
  });
});

describe("updateUserSchema", () => {
  it("部分的な更新データが通過する", () => {
    const result = updateUserSchema.safeParse({ name: "新しい名前" });
    expect(result.success).toBe(true);
  });

  it("空オブジェクトが通過する", () => {
    const result = updateUserSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("phoneの更新が正しい形式なら通過する", () => {
    const result = updateUserSchema.safeParse({ phone: "080-9999-0000" });
    expect(result.success).toBe(true);
  });

  it("phoneの更新が不正な形式ならエラーになる", () => {
    const result = updateUserSchema.safeParse({ phone: "not-a-phone" });
    expect(result.success).toBe(false);
  });
});
