import { matchRepository } from "@/lib/repositories/match.repository";
import { jobRepository } from "@/lib/repositories/job.repository";
import { userRepository } from "@/lib/repositories/user.repository";
import { NotFoundError, ConflictError } from "@/lib/errors";
import type { MatchStatus } from "@/generated/prisma/client";

function calculateDistance(lat1?: number | null, lng1?: number | null, lat2?: number | null, lng2?: number | null): number {
  if (!lat1 || !lng1 || !lat2 || !lng2) return 50;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateMatchScore(
  user: { lat?: number | null; lng?: number | null; skills: { skillId: string; level: number }[] },
  job: {
    lat?: number | null;
    lng?: number | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    skills: { skillId: string; minLevel: number }[];
    company: { industry: string };
  },
  userSalaryMin?: number,
  userSalaryMax?: number,
): number {
  // スキル適合度 (40%)
  let skillScore = 0;
  if (job.skills.length > 0) {
    const matchedSkills = job.skills.filter((js) =>
      user.skills.some((us) => us.skillId === js.skillId && us.level >= js.minLevel)
    );
    skillScore = (matchedSkills.length / job.skills.length) * 100;
  } else {
    skillScore = 50;
  }

  // 通勤利便性 (25%) — 距離が近いほど高スコア
  const distance = calculateDistance(user.lat, user.lng, job.lat, job.lng);
  const commuteScore = Math.max(0, 100 - distance * 2);

  // 給与希望合致 (20%)
  let salaryScore = 50;
  if (job.salaryMin != null && job.salaryMax != null && userSalaryMin != null) {
    const jobMid = (job.salaryMin + job.salaryMax) / 2;
    const userMid = userSalaryMin + ((userSalaryMax ?? userSalaryMin) - userSalaryMin) / 2;
    const diff = Math.abs(jobMid - userMid) / Math.max(jobMid, 1);
    salaryScore = Math.max(0, 100 - diff * 100);
  }

  // 職場文化適合 (10%) — 同業界経験の有無で簡易判定
  const cultureScore = 50;

  // キャリア成長性 (5%)
  let growthScore = 50;
  if (job.skills.length > 0) {
    const canGrow = job.skills.some((js) =>
      user.skills.some((us) => us.skillId === js.skillId && us.level < 5)
    );
    growthScore = canGrow ? 80 : 30;
  }

  const total =
    skillScore * 0.4 +
    commuteScore * 0.25 +
    salaryScore * 0.2 +
    cultureScore * 0.1 +
    growthScore * 0.05;

  return Math.round(total * 10) / 10;
}

export const matchService = {
  async getJobsWithScores(userId: string, filters?: {
    status?: string;
    shiftType?: string;
    industry?: string;
    salaryMin?: number;
    salaryMax?: number;
    location?: string;
  }) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("ユーザーが見つかりませんでした");

    const jobs = await jobRepository.findAll({
      status: "ACTIVE",
      ...(filters?.shiftType && { shiftType: filters.shiftType as "FULL_TIME" | "PART_TIME" | "SPOT" | "CONTRACT" }),
      ...(filters?.industry && { industry: filters.industry as "CONSTRUCTION" | "MANUFACTURING" | "TRANSPORT" | "LOGISTICS" | "SECURITY" | "NURSING" | "CLEANING" | "OTHER" }),
      ...(filters?.salaryMin && { salaryMin: Number(filters.salaryMin) }),
      ...(filters?.salaryMax && { salaryMax: Number(filters.salaryMax) }),
      ...(filters?.location && { location: filters.location }),
    });

    const userSkills = user.skills.map((us) => ({
      skillId: us.skillId,
      level: us.level,
    }));

    const jobsWithScores = jobs.map((job) => ({
      ...job,
      matchScore: calculateMatchScore(
        { lat: user.lat, lng: user.lng, skills: userSkills },
        {
          lat: job.lat,
          lng: job.lng,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          skills: job.skills.map((js) => ({ skillId: js.skillId, minLevel: js.minLevel })),
          company: { industry: job.company.industry },
        },
      ),
    }));

    jobsWithScores.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    return jobsWithScores;
  },

  async apply(userId: string, jobId: string) {
    const existing = await matchRepository.findByUserAndJob(userId, jobId);
    if (existing) throw new ConflictError("この求人には既に応募済みです");

    const job = await jobRepository.findById(jobId);
    if (!job) throw new NotFoundError("求人が見つかりませんでした");

    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("ユーザーが見つかりませんでした");

    const userSkills = user.skills.map((us) => ({
      skillId: us.skillId,
      level: us.level,
    }));

    const score = calculateMatchScore(
      { lat: user.lat, lng: user.lng, skills: userSkills },
      {
        lat: job.lat,
        lng: job.lng,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        skills: job.skills.map((js) => ({ skillId: js.skillId, minLevel: js.minLevel })),
        company: { industry: job.company.industry },
      },
    );

    return matchRepository.create({ userId, jobId, aiScore: score });
  },

  async getApplications(userId: string) {
    return matchRepository.findByUser(userId);
  },

  async getApplicants(jobId: string) {
    return matchRepository.findByJob(jobId);
  },

  async getCompanyApplicants(companyId: string) {
    return matchRepository.findByCompany(companyId);
  },

  async updateStatus(matchId: string, status: MatchStatus) {
    const match = await matchRepository.findById(matchId);
    if (!match) throw new NotFoundError("マッチングが見つかりませんでした");
    return matchRepository.updateStatus(matchId, status);
  },
};
