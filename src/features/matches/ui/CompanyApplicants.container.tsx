"use client";

import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useCompanyApplicants } from "@/features/matches/hooks/useCompanyApplicants";
import { useUpdateMatchStatus } from "@/features/matches/hooks/useApplicants";
import { CompanyApplicantsView } from "./CompanyApplicants.view";
import type { GroupedApplicant } from "./CompanyApplicants.view";
import type { MatchStatus, MatchWithDetails } from "@/lib/types/api";

function groupByUser(matches: MatchWithDetails[]): GroupedApplicant[] {
  const map = new Map<string, GroupedApplicant>();

  for (const m of matches) {
    const existing = map.get(m.userId);
    const app = {
      matchId: m.id,
      jobTitle: m.job.title,
      jobId: m.jobId,
      status: m.status,
      aiScore: m.aiScore,
      appliedAt: m.appliedAt,
      createdAt: m.createdAt,
    };

    if (existing) {
      existing.applications.push(app);
    } else {
      map.set(m.userId, {
        userId: m.userId,
        userName: m.user.name,
        phone: m.user.phone,
        location: m.user.location,
        skills: m.user.skills.map((us) => ({
          skillId: us.skillId,
          skillName: us.skill.name,
          level: us.level,
        })),
        applications: [app],
      });
    }
  }

  return Array.from(map.values());
}

export function CompanyApplicantsContainer() {
  const { data: matches, isLoading } = useCompanyApplicants();
  const updateStatus = useUpdateMatchStatus();
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = useMemo(() => {
    if (!matches) return [];
    if (statusFilter === "ALL") return matches;
    return matches.filter((m) => m.status === statusFilter);
  }, [matches, statusFilter]);

  const grouped = useMemo(() => groupByUser(filtered), [filtered]);

  const handleStatusChange = useCallback(
    (matchId: string, status: MatchStatus) => {
      updateStatus.mutate(
        { matchId, status },
        {
          onSuccess: () => toast.success("ステータスを更新しました"),
          onError: () => toast.error("ステータスの更新に失敗しました"),
        }
      );
    },
    [updateStatus]
  );

  return (
    <CompanyApplicantsView
      applicants={grouped}
      isLoading={isLoading}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      onStatusChange={handleStatusChange}
    />
  );
}
