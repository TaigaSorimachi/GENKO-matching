export async function getSkills(industry?: string) {
  const params = industry ? `?industry=${industry}` : "";
  const res = await fetch(`/api/skill${params}`);
  if (!res.ok) throw new Error("スキル一覧の取得に失敗しました");
  return res.json();
}
