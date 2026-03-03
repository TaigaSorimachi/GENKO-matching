export function createMockSkill(overrides?: Partial<{ id: string; name: string }>) {
  return {
    id: "skill-1",
    name: "フォークリフト",
    ...overrides,
  };
}

export function createMockUserSkill(overrides?: Partial<{ skillId: string; level: number; skill: ReturnType<typeof createMockSkill> }>) {
  return {
    skillId: "skill-1",
    level: 3,
    skill: createMockSkill(),
    ...overrides,
  };
}

export function createMockUser(overrides?: Partial<Record<string, unknown>>) {
  return {
    id: "user-1",
    type: "JOBSEEKER" as const,
    phone: "090-1234-5678",
    name: "テスト太郎",
    location: "東京都渋谷区",
    lat: 35.6595,
    lng: 139.7004,
    language: "ja",
    companyId: null,
    company: null,
    skills: [createMockUserSkill()],
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  };
}

export function createMockCompany(overrides?: Partial<Record<string, unknown>>) {
  return {
    id: "company-1",
    name: "テスト建設株式会社",
    industry: "CONSTRUCTION" as const,
    phone: "03-1234-5678",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  };
}

export function createMockJobSkill(overrides?: Partial<{ skillId: string; minLevel: number; skill: ReturnType<typeof createMockSkill> }>) {
  return {
    skillId: "skill-1",
    minLevel: 2,
    skill: createMockSkill(),
    ...overrides,
  };
}

export function createMockJob(overrides?: Partial<Record<string, unknown>>) {
  return {
    id: "job-1",
    companyId: "company-1",
    title: "フォークリフトオペレーター",
    description: "倉庫内でのフォークリフト作業",
    salaryMin: 250000,
    salaryMax: 350000,
    location: "東京都品川区",
    lat: 35.6284,
    lng: 139.7387,
    shiftType: "FULL_TIME" as const,
    urgency: "NORMAL" as const,
    status: "ACTIVE" as const,
    company: createMockCompany(),
    skills: [createMockJobSkill()],
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  };
}

export function createMockMatch(overrides?: Partial<Record<string, unknown>>) {
  return {
    id: "match-1",
    userId: "user-1",
    jobId: "job-1",
    status: "APPLIED" as const,
    aiScore: 75.5,
    appliedAt: new Date("2026-01-15"),
    hiredAt: null,
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
    user: createMockUser(),
    job: createMockJob(),
    ...overrides,
  };
}
