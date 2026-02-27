"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useApplicants, useUpdateMatchStatus } from "@/features/matches/hooks/useApplicants";
import { ApplicantListView } from "./ApplicantList.view";
import type { MatchStatus } from "@/lib/types/api";

type ApplicantListContainerProps = {
  jobId: string;
};

export function ApplicantListContainer({ jobId }: ApplicantListContainerProps) {
  const { data: applicants, isLoading } = useApplicants(jobId);
  const updateStatus = useUpdateMatchStatus();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleStatusChange = (matchId: string, status: MatchStatus) => {
    updateStatus.mutate(
      { matchId, status },
      {
        onSuccess: () => toast.success("ステータスを更新しました"),
        onError: () => toast.error("ステータスの更新に失敗しました"),
      }
    );
  };

  const handleToggleExpand = (matchId: string) => {
    setExpandedId((prev) => (prev === matchId ? null : matchId));
  };

  return (
    <ApplicantListView
      applicants={applicants ?? []}
      isLoading={isLoading}
      expandedId={expandedId}
      onStatusChange={handleStatusChange}
      onToggleExpand={handleToggleExpand}
    />
  );
}
