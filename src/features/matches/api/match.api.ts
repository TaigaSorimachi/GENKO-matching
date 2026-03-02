import type { MatchStatus } from "@/lib/types/api";

export async function getApplications(userId: string) {
  const res = await fetch(`/api/match?userId=${userId}`);
  if (!res.ok) throw new Error("応募一覧の取得に失敗しました");
  return res.json();
}

export async function applyToJob(userId: string, jobId: string) {
  const res = await fetch("/api/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, jobId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? "応募に失敗しました");
  }
  return res.json();
}

export async function getCompanyApplicants(companyId: string) {
  const res = await fetch(`/api/match?companyId=${companyId}`);
  if (!res.ok) throw new Error("応募者一覧の取得に失敗しました");
  return res.json();
}

export async function updateMatchStatus(matchId: string, status: MatchStatus) {
  const res = await fetch(`/api/match/${matchId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("ステータスの更新に失敗しました");
  return res.json();
}
