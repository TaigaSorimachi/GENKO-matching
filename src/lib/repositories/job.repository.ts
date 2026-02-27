import { prisma } from "@/lib/prisma";
import type { JobStatus, ShiftType, Industry } from "@/generated/prisma/client";

export const jobRepository = {
  findAll(filters?: {
    companyId?: string;
    status?: JobStatus;
    shiftType?: ShiftType;
    industry?: Industry;
    salaryMin?: number;
    salaryMax?: number;
    location?: string;
  }) {
    return prisma.job.findMany({
      where: {
        ...(filters?.companyId && { companyId: filters.companyId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.shiftType && { shiftType: filters.shiftType }),
        ...(filters?.industry && { company: { industry: filters.industry } }),
        ...(filters?.salaryMin && { salaryMax: { gte: filters.salaryMin } }),
        ...(filters?.salaryMax && { salaryMin: { lte: filters.salaryMax } }),
        ...(filters?.location && { location: { contains: filters.location, mode: "insensitive" as const } }),
      },
      include: {
        company: true,
        skills: { include: { skill: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: string) {
    return prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        skills: { include: { skill: true } },
      },
    });
  },

  create(data: {
    companyId: string;
    title: string;
    description: string;
    salaryMin?: number;
    salaryMax?: number;
    location: string;
    lat?: number;
    lng?: number;
    shiftType: ShiftType;
    urgency?: "NORMAL" | "URGENT" | "EMERGENCY";
    skills?: { skillId: string; minLevel: number }[];
  }) {
    const { skills, ...jobData } = data;
    return prisma.job.create({
      data: {
        ...jobData,
        ...(skills && {
          skills: {
            create: skills.map((s) => ({ skillId: s.skillId, minLevel: s.minLevel })),
          },
        }),
      },
      include: {
        company: true,
        skills: { include: { skill: true } },
      },
    });
  },

  async update(id: string, data: {
    title?: string;
    description?: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    location?: string;
    lat?: number;
    lng?: number;
    shiftType?: ShiftType;
    urgency?: "NORMAL" | "URGENT" | "EMERGENCY";
    status?: JobStatus;
    skills?: { skillId: string; minLevel: number }[];
  }) {
    const { skills, ...jobData } = data;

    if (skills) {
      await prisma.jobSkill.deleteMany({ where: { jobId: id } });
    }

    return prisma.job.update({
      where: { id },
      data: {
        ...jobData,
        ...(skills && {
          skills: {
            create: skills.map((s) => ({ skillId: s.skillId, minLevel: s.minLevel })),
          },
        }),
      },
      include: {
        company: true,
        skills: { include: { skill: true } },
      },
    });
  },

  delete(id: string) {
    return prisma.job.delete({ where: { id } });
  },
};
