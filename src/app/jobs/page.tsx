"use client";

import { useAuthStore } from "@/lib/stores/auth.store";
import { BottomNav } from "@/components/bottom-nav";
import { JobSearchContainer } from "@/features/jobs/ui/JobSearch.container";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobsPage() {
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
      <JobSearchContainer />
      <BottomNav />
    </main>
  );
}
