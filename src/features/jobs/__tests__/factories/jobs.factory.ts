import type { JobWithScore } from "@/lib/types/api";

export function createMockJob(overrides: Partial<JobWithScore> = {}): JobWithScore {
  return {
    id: "job-1",
    companyId: "company-1",
    title: "倉庫内軽作業スタッフ",
    description: "商品の仕分け・梱包作業を行います。",
    salaryMin: 10000,
    salaryMax: 15000,
    location: "東京都品川区",
    lat: 35.6,
    lng: 139.7,
    shiftType: "FULL_TIME",
    urgency: "NORMAL",
    status: "ACTIVE",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    company: {
      id: "company-1",
      name: "テスト株式会社",
      industry: "LOGISTICS",
      size: 50,
      address: "東京都品川区",
      lat: 35.6,
      lng: 139.7,
      verified: true,
      trustScore: 80,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
    skills: [],
    ...overrides,
  };
}

export function createMockJobSkill(overrides: Partial<JobWithScore["skills"][number]> = {}) {
  return {
    id: "js-1",
    jobId: "job-1",
    skillId: "skill-1",
    minLevel: 1,
    skill: {
      id: "skill-1",
      name: "フォークリフト",
      category: "資格",
      industry: "LOGISTICS" as const,
      equivIntl: null,
      createdAt: new Date("2026-01-01"),
    },
    ...overrides,
  };
}
