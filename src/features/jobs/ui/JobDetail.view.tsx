"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { JobWithScore } from "@/lib/types/api";

const SHIFT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "フルタイム",
  PART_TIME: "パート",
  SPOT: "スポット",
  CONTRACT: "契約",
};

const INDUSTRY_LABELS: Record<string, string> = {
  CONSTRUCTION: "建設",
  MANUFACTURING: "製造",
  TRANSPORT: "運輸",
  LOGISTICS: "物流",
  SECURITY: "警備",
  NURSING: "介護",
  CLEANING: "清掃",
  OTHER: "その他",
};

function formatSalary(min?: number | null, max?: number | null): string {
  if (min != null && max != null) {
    return `¥${min.toLocaleString()}〜¥${max.toLocaleString()}/日`;
  }
  if (min != null) {
    return `¥${min.toLocaleString()}〜/日`;
  }
  if (max != null) {
    return `〜¥${max.toLocaleString()}/日`;
  }
  return "要相談";
}

type JobDetailViewProps = {
  job: JobWithScore | null;
  isLoading: boolean;
  onApply: () => void;
  isApplying: boolean;
  hasApplied: boolean;
};

function JobDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/3 mt-2" />
      </div>
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

export function JobDetailView({
  job,
  isLoading,
  onApply,
  isApplying,
  hasApplied,
}: JobDetailViewProps) {
  if (isLoading) {
    return <JobDetailSkeleton />;
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <p className="text-lg">求人が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 mt-1">{job.company.name}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {job.matchScore != null && (
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-sm">
                {Math.round(job.matchScore)}%マッチ
              </Badge>
            )}
            {job.urgency !== "NORMAL" && (
              <Badge variant="destructive">
                {job.urgency === "EMERGENCY" ? "緊急" : "急募"}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">求人詳細</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">給与</p>
              <p className="text-lg font-bold text-blue-600">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">勤務地</p>
              <p className="font-medium">{job.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">シフト種別</p>
              <Badge variant="outline">
                {SHIFT_TYPE_LABELS[job.shiftType] ?? job.shiftType}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">業界</p>
              <p className="font-medium">
                {INDUSTRY_LABELS[job.company.industry] ?? job.company.industry}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-gray-500 mb-2">仕事内容</p>
            <p className="text-gray-800 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {job.skills.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-gray-500 mb-2">必要スキル</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((js) => (
                    <Badge key={js.skillId} variant="secondary">
                      {js.skill.name}
                      {js.minLevel > 1 && (
                        <span className="ml-1 text-gray-400">
                          Lv.{js.minLevel}+
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="sticky bottom-20 md:bottom-4">
        {hasApplied ? (
          <Button disabled className="w-full h-12 text-lg" size="lg">
            応募済み
          </Button>
        ) : (
          <Button
            onClick={onApply}
            disabled={isApplying}
            className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isApplying ? "応募中..." : "応募する"}
          </Button>
        )}
      </div>
    </div>
  );
}
