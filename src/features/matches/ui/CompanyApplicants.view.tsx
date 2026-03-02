"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import type { MatchWithDetails, MatchStatus } from "@/lib/types/api";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  APPLIED: { label: "応募済み", className: "bg-blue-100 text-blue-700" },
  SCREENING: { label: "選考中", className: "bg-yellow-100 text-yellow-700" },
  INTERVIEW: { label: "面接", className: "bg-purple-100 text-purple-700" },
  OFFERED: { label: "内定", className: "bg-green-100 text-green-700" },
  HIRED: { label: "採用", className: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "不採用", className: "bg-red-100 text-red-700" },
  WITHDRAWN: { label: "辞退", className: "bg-gray-100 text-gray-700" },
};

const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([value, cfg]) => ({
  value: value as MatchStatus,
  label: cfg.label,
}));

type GroupedApplicant = {
  userId: string;
  userName: string;
  phone: string;
  location: string | null;
  skills: { skillId: string; skillName: string; level: number }[];
  applications: {
    matchId: string;
    jobTitle: string;
    jobId: string;
    status: string;
    aiScore: number | null;
    appliedAt: Date | null;
    createdAt: Date;
  }[];
};

type CompanyApplicantsViewProps = {
  applicants: GroupedApplicant[];
  isLoading: boolean;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onStatusChange: (matchId: string, status: MatchStatus) => void;
};

function ApplicantSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-lg" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <Users className="mb-3 h-12 w-12 text-gray-300" />
      <p className="text-lg">応募者はいません</p>
      <p className="mt-1 text-sm text-gray-400">
        求人に応募があるとここに表示されます
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: "bg-gray-100 text-gray-700" };
  return (
    <Badge className={`${cfg.className} hover:${cfg.className} text-xs`}>
      {cfg.label}
    </Badge>
  );
}

function ApplicationRow({
  app,
  onStatusChange,
}: {
  app: GroupedApplicant["applications"][number];
  onStatusChange: (matchId: string, status: MatchStatus) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-gray-50 px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{app.jobTitle}</p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
          <span>{new Date(app.createdAt).toLocaleDateString("ja-JP")}</span>
          {app.aiScore != null && (
            <span className="font-medium text-blue-600">{Math.round(app.aiScore)}%マッチ</span>
          )}
        </div>
      </div>
      <Select
        value={app.status}
        onValueChange={(val) => onStatusChange(app.matchId, val as MatchStatus)}
      >
        <SelectTrigger className="h-7 w-24 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ApplicantCard({
  applicant,
  onStatusChange,
}: {
  applicant: GroupedApplicant;
  onStatusChange: (matchId: string, status: MatchStatus) => void;
}) {
  const latestStatus = applicant.applications[0]?.status ?? "APPLIED";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
              {applicant.userName.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-base">{applicant.userName}</CardTitle>
              <p className="text-xs text-gray-500">{applicant.phone}</p>
              {applicant.location && (
                <p className="text-xs text-gray-500">{applicant.location}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={latestStatus} />
            <Badge variant="outline" className="text-xs">
              {applicant.applications.length}件応募
            </Badge>
          </div>
        </div>
        {applicant.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {applicant.skills.map((s) => (
              <Badge key={s.skillId} variant="secondary" className="text-xs">
                {s.skillName} Lv.{s.level}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-xs font-medium text-gray-500">応募履歴</p>
        <div className="space-y-2">
          {applicant.applications.map((app) => (
            <ApplicationRow
              key={app.matchId}
              app={app}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function CompanyApplicantsView({
  applicants,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  onStatusChange,
}: CompanyApplicantsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">応募者一覧</h1>
          <p className="mt-1 text-sm text-gray-500">
            全{applicants.length}名の応募者
          </p>
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">すべて</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <ApplicantSkeleton />
      ) : applicants.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <ApplicantCard
              key={applicant.userId}
              applicant={applicant}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export type { GroupedApplicant };
