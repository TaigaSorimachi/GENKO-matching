"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { MatchWithDetails } from "@/lib/types/api";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  SUGGESTED: { label: "提案済み", className: "bg-gray-100 text-gray-700" },
  APPLIED: { label: "応募中", className: "bg-blue-100 text-blue-700" },
  SCREENING: { label: "選考中", className: "bg-yellow-100 text-yellow-700" },
  INTERVIEW: { label: "面接", className: "bg-purple-100 text-purple-700" },
  OFFERED: { label: "内定", className: "bg-green-100 text-green-700" },
  HIRED: { label: "採用", className: "bg-green-100 text-green-700" },
  REJECTED: { label: "不採用", className: "bg-red-100 text-red-700" },
  WITHDRAWN: { label: "辞退", className: "bg-gray-100 text-gray-500" },
};

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type ApplicationListViewProps = {
  applications: MatchWithDetails[];
  isLoading: boolean;
};

function ApplicationCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-6 w-16" />
      </CardContent>
    </Card>
  );
}

function ApplicationCard({ application }: { application: MatchWithDetails }) {
  const statusConfig = STATUS_CONFIG[application.status] ?? {
    label: application.status,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardContent className="flex items-center justify-between gap-4 py-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {application.job.title}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {application.job.company.name}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-400">
              応募日: {formatDate(application.appliedAt)}
            </span>
            {application.aiScore != null && (
              <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 text-xs">
                {Math.round(application.aiScore * 100)}%マッチ
              </Badge>
            )}
          </div>
        </div>
        <Badge className={`${statusConfig.className} hover:${statusConfig.className} shrink-0`}>
          {statusConfig.label}
        </Badge>
      </CardContent>
    </Card>
  );
}

export function ApplicationListView({
  applications,
  isLoading,
}: ApplicationListViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <ApplicationCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <p className="text-lg">応募履歴がありません</p>
        <p className="text-sm mt-1">求人を探して応募してみましょう</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
}
