import { prisma } from "@/lib/prisma";
import type { UserType } from "@/generated/prisma/client";

export const userRepository = {
  findAll() {
    return prisma.user.findMany({
      include: { company: true, skills: { include: { skill: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { company: true, skills: { include: { skill: true } } },
    });
  },

  findByPhone(phone: string) {
    return prisma.user.findUnique({ where: { phone } });
  },

  create(data: {
    type: UserType;
    phone: string;
    name: string;
    location?: string;
    lat?: number;
    lng?: number;
    language?: string;
    companyId?: string;
  }) {
    return prisma.user.create({
      data,
      include: { company: true, skills: { include: { skill: true } } },
    });
  },

  update(id: string, data: {
    name?: string;
    phone?: string;
    location?: string;
    lat?: number;
    lng?: number;
    language?: string;
  }) {
    return prisma.user.update({
      where: { id },
      data,
      include: { company: true, skills: { include: { skill: true } } },
    });
  },

  delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  addSkill(userId: string, skillId: string, level: number) {
    return prisma.userSkill.create({
      data: { userId, skillId, level },
      include: { skill: true },
    });
  },

  updateSkill(userId: string, skillId: string, level: number) {
    return prisma.userSkill.update({
      where: { userId_skillId: { userId, skillId } },
      data: { level },
      include: { skill: true },
    });
  },

  removeSkill(userId: string, skillId: string) {
    return prisma.userSkill.delete({
      where: { userId_skillId: { userId, skillId } },
    });
  },
};
