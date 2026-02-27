"use client";

import { KpiCardView } from "./KpiCard.view";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardKpi, MatchWithDetails } from "@/lib/types/api";

const MATCH_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  APPLIED: { label: "応募済み", className: "bg-blue-100 text-blue-700" },
  SCREENING: { label: "選考中", className: "bg-yellow-100 text-yellow-700" },
  INTERVIEW: { label: "面接", className: "bg-purple-100 text-purple-700" },
  OFFERED: { label: "内定", className: "bg-green-100 text-green-700" },
  HIRED: { label: "採用", className: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "不採用", className: "bg-red-100 text-red-700" },
  WITHDRAWN: { label: "辞退", className: "bg-gray-100 text-gray-700" },
  SUGGESTED: { label: "提案", className: "bg-gray-100 text-gray-600" },
};

type DashboardViewProps = {
  kpi: DashboardKpi | undefined;
  recentApplications: MatchWithDetails[];
  isLoading: boolean;
};

export function DashboardView({ kpi, recentApplications, isLoading }: DashboardViewProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCardView
          title="総応募数"
          value={kpi?.totalApplications ?? 0}
          isLoading={isLoading}
        />
        <KpiCardView
          title="面接予定"
          value={kpi?.interviewScheduled ?? 0}
          isLoading={isLoading}
        />
        <KpiCardView
          title="採用率"
          value={kpi ? `${kpi.hireRate}%` : "0%"}
          isLoading={isLoading}
        />
        <KpiCardView
          title="公開中の求人"
          value={kpi?.activeJobs ?? 0}
          isLoading={isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近の応募</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentApplications.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              まだ応募はありません
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>応募者名</TableHead>
                  <TableHead>求人タイトル</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>応募日</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.map((application) => {
                  const statusInfo = MATCH_STATUS_LABELS[application.status] ?? {
                    label: application.status,
                    className: "bg-gray-100 text-gray-700",
                  };
                  return (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {application.user.name}
                      </TableCell>
                      <TableCell>{application.job.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusInfo.className}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString("ja-JP")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
