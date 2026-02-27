"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import type { JobWithScore } from "@/lib/types/api";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "下書き", className: "bg-gray-100 text-gray-700" },
  ACTIVE: { label: "公開中", className: "bg-green-100 text-green-700" },
  CLOSED: { label: "終了", className: "bg-red-100 text-red-700" },
  EXPIRED: { label: "期限切れ", className: "bg-gray-100 text-gray-500" },
};

const SHIFT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "フルタイム",
  PART_TIME: "パート",
  SPOT: "スポット",
  CONTRACT: "契約",
};

type JobManagementViewProps = {
  jobs: JobWithScore[];
  isLoading: boolean;
  onDelete: (id: string) => void;
};

function formatSalary(min?: number | null, max?: number | null): string {
  if (min != null && max != null) return `${min.toLocaleString()}~${max.toLocaleString()}円`;
  if (min != null) return `${min.toLocaleString()}円~`;
  if (max != null) return `~${max.toLocaleString()}円`;
  return "未設定";
}

export function JobManagementView({ jobs, isLoading, onDelete }: JobManagementViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">求人管理</h1>
        <Button asChild>
          <Link href="/company/jobs/new">
            <Plus className="mr-1 h-4 w-4" />
            新規求人作成
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <p className="mb-4 text-lg">まだ求人がありません</p>
          <Button asChild>
            <Link href="/company/jobs/new">
              <Plus className="mr-1 h-4 w-4" />
              最初の求人を作成する
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>タイトル</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>勤務形態</TableHead>
                <TableHead>給与</TableHead>
                <TableHead className="text-right">アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => {
                const statusInfo = STATUS_LABELS[job.status] ?? {
                  label: job.status,
                  className: "bg-gray-100 text-gray-700",
                };
                return (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusInfo.className}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {SHIFT_TYPE_LABELS[job.shiftType] ?? job.shiftType}
                    </TableCell>
                    <TableCell>{formatSalary(job.salaryMin, job.salaryMax)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-xs" asChild title="応募者一覧">
                          <Link href={`/company/jobs/${job.id}/applicants`}>
                            <Users className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon-xs" asChild title="編集">
                          <Link href={`/company/jobs/${job.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          title="削除"
                          onClick={() => onDelete(job.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
