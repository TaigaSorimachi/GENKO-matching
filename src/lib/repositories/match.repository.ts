import { prisma } from "@/lib/prisma";
import type { MatchStatus } from "@/generated/prisma/client";

export const matchRepository = {
  findByUser(userId: string) {
    return prisma.match.findMany({
      where: { userId },
      include: {
        job: { include: { company: true, skills: { include: { skill: true } } } },
        user: { include: { skills: { include: { skill: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findByJob(jobId: string) {
    return prisma.match.findMany({
      where: { jobId },
      include: {
        user: { include: { skills: { include: { skill: true } } } },
        job: { include: { company: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findByUserAndJob(userId: string, jobId: string) {
    return prisma.match.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });
  },

  findById(id: string) {
    return prisma.match.findUnique({
      where: { id },
      include: {
        user: { include: { skills: { include: { skill: true } } } },
        job: { include: { company: true, skills: { include: { skill: true } } } },
      },
    });
  },

  create(data: { userId: string; jobId: string; aiScore?: number }) {
    return prisma.match.create({
      data: { ...data, status: "APPLIED", appliedAt: new Date() },
      include: {
        job: { include: { company: true, skills: { include: { skill: true } } } },
        user: { include: { skills: { include: { skill: true } } } },
      },
    });
  },

  updateStatus(id: string, status: MatchStatus) {
    const hiredAt = status === "HIRED" ? new Date() : undefined;
    return prisma.match.update({
      where: { id },
      data: { status, ...(hiredAt && { hiredAt }) },
      include: {
        user: { include: { skills: { include: { skill: true } } } },
        job: { include: { company: true } },
      },
    });
  },

  findByCompany(companyId: string) {
    return prisma.match.findMany({
      where: { job: { companyId } },
      include: {
        user: { include: { skills: { include: { skill: true } } } },
        job: { include: { company: true, skills: { include: { skill: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  countByCompany(companyId: string, status?: MatchStatus) {
    return prisma.match.count({
      where: {
        job: { companyId },
        ...(status && { status }),
      },
    });
  },
};
