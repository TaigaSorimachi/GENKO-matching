import { prisma } from "@/lib/prisma";

export const companyRepository = {
  findById(id: string) {
    return prisma.company.findUnique({
      where: { id },
      include: { jobs: true, users: true },
    });
  },

  findAll() {
    return prisma.company.findMany({
      include: { jobs: true },
      orderBy: { createdAt: "desc" },
    });
  },
};
