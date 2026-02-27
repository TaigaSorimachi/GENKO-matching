"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { MatchWithDetails, MatchStatus } from "@/lib/types/api";

const MATCH_STATUS_OPTIONS: { value: MatchStatus; label: string; className: string }[] = [
  { value: "APPLIED", label: "応募済み", className: "bg-blue-100 text-blue-700" },
  { value: "SCREENING", label: "選考中", className: "bg-yellow-100 text-yellow-700" },
  { value: "INTERVIEW", label: "面接", className: "bg-purple-100 text-purple-700" },
  { value: "OFFERED", label: "内定", className: "bg-green-100 text-green-700" },
  { value: "HIRED", label: "採用", className: "bg-emerald-100 text-emerald-700" },
  { value: "REJECTED", label: "不採用", className: "bg-red-100 text-red-700" },
  { value: "WITHDRAWN", label: "辞退", className: "bg-gray-100 text-gray-700" },
];

type ApplicantListViewProps = {
  applicants: MatchWithDetails[];
  isLoading: boolean;
  expandedId: string | null;
  onStatusChange: (matchId: string, status: MatchStatus) => void;
  onToggleExpand: (matchId: string) => void;
};

export function ApplicantListView({
  applicants,
  isLoading,
  expandedId,
  onStatusChange,
  onToggleExpand,
}: ApplicantListViewProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">応募者一覧</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : applicants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <p className="text-lg">まだ応募者はいません</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>応募者名</TableHead>
                <TableHead>スキル</TableHead>
                <TableHead>マッチスコア</TableHead>
                <TableHead>応募日</TableHead>
                <TableHead>ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => {
                const isExpanded = expandedId === applicant.id;
                return (
                  <>
                    <TableRow key={applicant.id} className="cursor-pointer">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onToggleExpand(applicant.id)}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {applicant.user.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {applicant.user.skills.slice(0, 3).map((us) => (
                            <Badge
                              key={us.skillId}
                              variant="secondary"
                              className="text-xs"
                            >
                              {us.skill.name} Lv.{us.level}
                            </Badge>
                          ))}
                          {applicant.user.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{applicant.user.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {applicant.aiScore != null ? (
                          <span className="font-semibold text-blue-600">
                            {Math.round(applicant.aiScore)}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(applicant.createdAt).toLocaleDateString("ja-JP")}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={applicant.status}
                          onValueChange={(val) =>
                            onStatusChange(applicant.id, val as MatchStatus)
                          }
                        >
                          <SelectTrigger className="h-8 w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MATCH_STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${applicant.id}-detail`}>
                        <TableCell colSpan={6}>
                          <Card className="my-2 border-blue-100">
                            <CardHeader>
                              <CardTitle className="text-sm">
                                {applicant.user.name} のプロフィール
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div>
                                <p className="text-xs font-medium text-gray-500">
                                  電話番号
                                </p>
                                <p className="text-sm">{applicant.user.phone}</p>
                              </div>
                              {applicant.user.location && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500">
                                    所在地
                                  </p>
                                  <p className="text-sm">{applicant.user.location}</p>
                                </div>
                              )}
                              <div>
                                <p className="mb-1 text-xs font-medium text-gray-500">
                                  全スキル
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {applicant.user.skills.map((us) => (
                                    <Badge
                                      key={us.skillId}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {us.skill.name} Lv.{us.level}
                                    </Badge>
                                  ))}
                                  {applicant.user.skills.length === 0 && (
                                    <span className="text-sm text-gray-400">
                                      スキル未登録
                                    </span>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
