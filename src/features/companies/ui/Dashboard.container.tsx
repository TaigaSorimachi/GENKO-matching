"use client";

import { useDashboard } from "@/features/companies/hooks/useDashboard";
import { DashboardView } from "./Dashboard.view";
import type { DashboardKpi } from "@/lib/types/api";

export function DashboardContainer() {
  const { data, isLoading } = useDashboard();

  const kpi: DashboardKpi | undefined = data
    ? {
        totalApplications: data.totalApplications,
        interviewScheduled: data.interviewScheduled,
        hireRate: data.hireRate,
        activeJobs: data.activeJobs,
      }
    : undefined;

  return (
    <DashboardView
      kpi={kpi}
      recentApplications={data?.recentApplications ?? []}
      isLoading={isLoading}
    />
  );
}
