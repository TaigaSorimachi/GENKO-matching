export async function getUser(id: string) {
  const res = await fetch(`/api/user/${id}`);
  if (!res.ok) throw new Error("ユーザー情報の取得に失敗しました");
  return res.json();
}

export async function updateUser(id: string, data: { name?: string; phone?: string; location?: string; language?: string }) {
  const res = await fetch(`/api/user/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("プロフィールの更新に失敗しました");
  return res.json();
}

export async function addUserSkill(userId: string, skillId: string, level: number) {
  const res = await fetch(`/api/user/${userId}/skills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skillId, level }),
  });
  if (!res.ok) throw new Error("スキルの追加に失敗しました");
  return res.json();
}

export async function updateUserSkill(userId: string, skillId: string, level: number) {
  const res = await fetch(`/api/user/${userId}/skills`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skillId, level }),
  });
  if (!res.ok) throw new Error("スキルの更新に失敗しました");
  return res.json();
}

export async function removeUserSkill(userId: string, skillId: string) {
  const res = await fetch(`/api/user/${userId}/skills`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skillId }),
  });
  if (!res.ok) throw new Error("スキルの削除に失敗しました");
  return res.json();
}
