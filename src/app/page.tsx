"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import { BottomNav } from "@/components/bottom-nav";
import { JobListContainer } from "@/features/jobs/ui/JobList.container";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
  const { currentUser } = useAuthStore();

  useEffect(() => {
    if (currentUser?.type === "EMPLOYER") {
      router.replace("/company");
    }
  }, [currentUser, router]);

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

  if (currentUser.type === "EMPLOYER") {
    return null;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            こんにちは、{currentUser.name}さん
          </h1>
          <p className="text-gray-500 mt-1">
            あなたにおすすめの求人をご紹介します
          </p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">おすすめ求人</h2>
          <Link href="/jobs">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              すべて見る
            </Button>
          </Link>
        </div>

        <JobListContainer limit={10} />
      </div>
      <BottomNav />
    </main>
  );
}
