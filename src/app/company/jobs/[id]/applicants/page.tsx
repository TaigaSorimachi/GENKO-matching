"use client";

import { useParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import { ApplicantList } from "@/features/matches/ui/applicant-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ApplicantsPage() {
  const params = useParams<{ id: string }>();
  const { currentUser } = useAuthStore();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        ユーザーを選択してください
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/company/jobs">
          <ArrowLeft className="mr-1 h-4 w-4" />
          求人管理に戻る
        </Link>
      </Button>
      <ApplicantList jobId={params.id} />
    </div>
  );
}
