import { matchRepository } from "@/lib/repositories/match.repository";
import { jobRepository } from "@/lib/repositories/job.repository";
import type { DashboardKpi } from "@/lib/types/api";

export const dashboardService = {
  async getKpi(companyId: string): Promise<DashboardKpi> {
    const [totalApplications, interviewScheduled, hired, activeJobsList] = await Promise.all([
      matchRepository.countByCompany(companyId),
      matchRepository.countByCompany(companyId, "INTERVIEW"),
      matchRepository.countByCompany(companyId, "HIRED"),
      jobRepository.findAll({ companyId, status: "ACTIVE" }),
    ]);

    const hireRate = totalApplications > 0 ? Math.round((hired / totalApplications) * 1000) / 10 : 0;

    return {
      totalApplications,
      interviewScheduled,
      hireRate,
      activeJobs: activeJobsList.length,
    };
  },

  async getRecentApplications(companyId: string, limit = 5) {
    const jobs = await jobRepository.findAll({ companyId });
    const jobIds = jobs.map((j) => j.id);

    const allApplicants = [];
    for (const jobId of jobIds) {
      const applicants = await matchRepository.findByJob(jobId);
      allApplicants.push(...applicants);
    }

    allApplicants.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return allApplicants.slice(0, limit);
  },
};
