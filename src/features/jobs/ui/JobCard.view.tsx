"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { JobWithScore } from "@/lib/types/api";
import Link from "next/link";

const SHIFT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "フルタイム",
  PART_TIME: "パート",
  SPOT: "スポット",
  CONTRACT: "契約",
};

type JobCardViewProps = {
  job: JobWithScore;
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

function UrgencyBadge({ urgency }: { urgency: string }) {
  if (urgency === "NORMAL") return null;
  return (
    <Badge variant="destructive" className="text-xs">
      {urgency === "EMERGENCY" ? "緊急" : "急募"}
    </Badge>
  );
}

function MatchScoreBadge({ score }: { score?: number }) {
  if (score == null) return null;
  return (
    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">
      {Math.round(score * 100)}%マッチ
    </Badge>
  );
}

export function JobCardView({ job }: JobCardViewProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold leading-tight line-clamp-2">
              {job.title}
            </CardTitle>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <MatchScoreBadge score={job.matchScore} />
              <UrgencyBadge urgency={job.urgency} />
            </div>
          </div>
          <p className="text-sm text-gray-500">{job.company.name}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-lg font-bold text-blue-600">
            {formatSalary(job.salaryMin, job.salaryMax)}
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>📍</span>
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Badge variant="outline" className="text-xs">
              {SHIFT_TYPE_LABELS[job.shiftType] ?? job.shiftType}
            </Badge>
          </div>
          {job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {job.skills.map((js) => (
                <Badge
                  key={js.skillId}
                  variant="secondary"
                  className="text-xs"
                >
                  {js.skill.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
