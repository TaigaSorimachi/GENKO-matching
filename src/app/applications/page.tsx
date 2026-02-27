"use client";

import { useAuthStore } from "@/lib/stores/auth.store";
import { BottomNav } from "@/components/bottom-nav";
import { ApplicationListContainer } from "@/features/matches/ui/ApplicationList.container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationsPage() {
  const { currentUser } = useAuthStore();

  if (!currentUser) {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6">
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Skeleton className="h-8 w-48 mb-4" />
          <p className="text-lg">ユーザーを選択してください</p>
          <p className="text-sm mt-1">ヘッダーからユーザーを切り替えられます</p>
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">応募一覧</h1>
        <ApplicationListContainer />
      </div>
      <BottomNav />
    </main>
  );
}
