import { prisma } from "@/lib/prisma";
import type { Industry } from "@/generated/prisma/client";

export const skillRepository = {
  findAll(industry?: Industry) {
    return prisma.skill.findMany({
      where: industry ? { industry } : undefined,
      orderBy: { name: "asc" },
    });
  },

  findById(id: string) {
    return prisma.skill.findUnique({ where: { id } });
  },
};
