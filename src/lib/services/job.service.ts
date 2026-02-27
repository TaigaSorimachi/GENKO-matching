import { jobRepository } from "@/lib/repositories/job.repository";
import { NotFoundError } from "@/lib/errors";
import type { CreateJobRequest, UpdateJobRequest } from "@/lib/types/api";
import type { JobStatus, ShiftType, Industry } from "@/generated/prisma/client";

export const jobService = {
  async getAll(filters?: {
    companyId?: string;
    status?: JobStatus;
    shiftType?: ShiftType;
    industry?: Industry;
    salaryMin?: number;
    salaryMax?: number;
    location?: string;
  }) {
    return jobRepository.findAll(filters);
  },

  async getById(id: string) {
    const job = await jobRepository.findById(id);
    if (!job) throw new NotFoundError("求人が見つかりませんでした");
    return job;
  },

  async create(data: CreateJobRequest) {
    return jobRepository.create(data);
  },

  async update(id: string, data: UpdateJobRequest) {
    await this.getById(id);
    return jobRepository.update(id, data);
  },

  async delete(id: string) {
    await this.getById(id);
    return jobRepository.delete(id);
  },
};
