export async function getDashboard(companyId: string) {
  const res = await fetch(`/api/dashboard?companyId=${companyId}`);
  if (!res.ok) throw new Error("ダッシュボードの取得に失敗しました");
  return res.json();
}
