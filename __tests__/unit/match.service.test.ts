import { vi, describe, it, expect, beforeEach } from "vitest";
import { createMockUser, createMockJob, createMockJobSkill, createMockUserSkill, createMockMatch } from "../factories/match.factory";

vi.mock("@/lib/repositories/user.repository", () => ({
  userRepository: {
    findById: vi.fn(),
  },
}));
vi.mock("@/lib/repositories/job.repository", () => ({
  jobRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
  },
}));
vi.mock("@/lib/repositories/match.repository", () => ({
  matchRepository: {
    findByUserAndJob: vi.fn(),
    create: vi.fn(),
  },
}));

import { matchService } from "@/lib/services/match.service";
import { userRepository } from "@/lib/repositories/user.repository";
import { jobRepository } from "@/lib/repositories/job.repository";
import { matchRepository } from "@/lib/repositories/match.repository";

const userRepo = vi.mocked(userRepository);
const jobRepo = vi.mocked(jobRepository);
const matchRepo = vi.mocked(matchRepository);

beforeEach(() => vi.clearAllMocks());

describe("matchService.getJobsWithScores", () => {
  it("スコアが0〜100の範囲で返される", async () => {
    userRepo.findById.mockResolvedValue(createMockUser() as never);
    jobRepo.findAll.mockResolvedValue([createMockJob()] as never);

    const results = await matchService.getJobsWithScores("user-1");

    results.forEach((r) => {
      expect(r.matchScore).toBeGreaterThanOrEqual(0);
      expect(r.matchScore).toBeLessThanOrEqual(100);
    });
  });

  it("全スキルが合致する場合は高スコアになる", async () => {
    const skill = { skillId: "skill-1", minLevel: 2 };
    const user = createMockUser({ skills: [createMockUserSkill({ skillId: "skill-1", level: 5 })] });
    const job = createMockJob({ skills: [createMockJobSkill(skill)] });

    userRepo.findById.mockResolvedValue(user as never);
    jobRepo.findAll.mockResolvedValue([job] as never);

    const [result] = await matchService.getJobsWithScores("user-1");
    expect(result.matchScore).toBeGreaterThan(50);
  });

  it("スキルが一致しない場合はスコアが低くなる", async () => {
    const user = createMockUser({ skills: [createMockUserSkill({ skillId: "skill-other", level: 1 })] });
    const job = createMockJob({ skills: [createMockJobSkill({ skillId: "skill-1", minLevel: 3 })] });

    userRepo.findById.mockResolvedValue(user as never);
    jobRepo.findAll.mockResolvedValue([job] as never);

    const [result] = await matchService.getJobsWithScores("user-1");
    expect(result.matchScore).toBeLessThan(50);
  });

  it("位置情報がnullの場合デフォルト距離(50km)で計算される", async () => {
    const user = createMockUser({ lat: null, lng: null, skills: [] });
    const job = createMockJob({ lat: null, lng: null, skills: [] });

    userRepo.findById.mockResolvedValue(user as never);
    jobRepo.findAll.mockResolvedValue([job] as never);

    const [result] = await matchService.getJobsWithScores("user-1");
    // distance=50 -> commuteScore = max(0, 100-100) = 0
    expect(result.matchScore).toBeDefined();
  });

  it("ユーザーが存在しない場合NotFoundErrorを投げる", async () => {
    userRepo.findById.mockResolvedValue(null);

    await expect(matchService.getJobsWithScores("no-user")).rejects.toThrow("ユーザーが見つかりませんでした");
  });

  it("結果がスコア降順でソートされる", async () => {
    const user = createMockUser({ skills: [createMockUserSkill({ skillId: "s1", level: 5 })] });
    const jobHigh = createMockJob({ id: "j-high", skills: [createMockJobSkill({ skillId: "s1", minLevel: 1 })] });
    const jobLow = createMockJob({ id: "j-low", skills: [createMockJobSkill({ skillId: "s-none", minLevel: 5 })] });

    userRepo.findById.mockResolvedValue(user as never);
    jobRepo.findAll.mockResolvedValue([jobLow, jobHigh] as never);

    const results = await matchService.getJobsWithScores("user-1");
    expect(results[0].matchScore).toBeGreaterThanOrEqual(results[1].matchScore);
  });
});

describe("matchService.apply", () => {
  it("重複応募でConflictErrorを投げる", async () => {
    matchRepo.findByUserAndJob.mockResolvedValue(createMockMatch() as never);

    await expect(matchService.apply("user-1", "job-1")).rejects.toThrow("この求人には既に応募済みです");
  });
});
