import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPool() {
  // Use individual DB_* vars if available, otherwise parse DATABASE_URL
  if (process.env.DB_HOST) {
    return new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || "postgres",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD,
      ...(process.env.NODE_ENV === "production" && {
        ssl: { rejectUnauthorized: false },
      }),
    });
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

function createPrismaClient() {
  const pool = createPool();
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
