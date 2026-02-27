"use client";

import { useApplications } from "@/features/matches/hooks/useApplications";
import { ApplicationListView } from "@/features/matches/ui/ApplicationList.view";

export function ApplicationListContainer() {
  const { data: applications, isLoading } = useApplications();

  return (
    <ApplicationListView
      applications={applications ?? []}
      isLoading={isLoading}
    />
  );
}
