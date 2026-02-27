import type { JobWithScore, CreateJobRequest, UpdateJobRequest } from "@/lib/types/api";

export async function getJobs(params?: {
  userId?: string;
  companyId?: string;
  status?: string;
  shiftType?: string;
  industry?: string;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
}): Promise<JobWithScore[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) searchParams.set(key, String(value));
    });
  }
  const res = await fetch(`/api/job?${searchParams}`);
  if (!res.ok) throw new Error("求人の取得に失敗しました");
  return res.json();
}

export async function getJob(id: string): Promise<JobWithScore> {
  const res = await fetch(`/api/job/${id}`);
  if (!res.ok) throw new Error("求人が見つかりませんでした");
  return res.json();
}

export async function createJob(data: CreateJobRequest): Promise<JobWithScore> {
  const res = await fetch("/api/job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? "求人の作成に失敗しました");
  }
  return res.json();
}

export async function updateJob(id: string, data: UpdateJobRequest): Promise<JobWithScore> {
  const res = await fetch(`/api/job/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? "求人の更新に失敗しました");
  }
  return res.json();
}

export async function deleteJob(id: string): Promise<void> {
  const res = await fetch(`/api/job/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("求人の削除に失敗しました");
}

export async function getApplicants(jobId: string) {
  const res = await fetch(`/api/job/${jobId}/applicants`);
  if (!res.ok) throw new Error("応募者の取得に失敗しました");
  return res.json();
}
