"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INDUSTRY_OPTIONS = [
  { value: "CONSTRUCTION", label: "建設" },
  { value: "MANUFACTURING", label: "製造" },
  { value: "TRANSPORT", label: "運輸" },
  { value: "LOGISTICS", label: "物流" },
  { value: "SECURITY", label: "警備" },
  { value: "NURSING", label: "介護" },
  { value: "CLEANING", label: "清掃" },
  { value: "OTHER", label: "その他" },
];

const SHIFT_TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "フルタイム" },
  { value: "PART_TIME", label: "パート" },
  { value: "SPOT", label: "スポット" },
  { value: "CONTRACT", label: "契約" },
];

export type JobFilters = {
  industry?: string;
  shiftType?: string;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
};

type JobFilterViewProps = {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
};

export function JobFilterView({ filters, onFilterChange }: JobFilterViewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="space-y-1.5">
        <Label htmlFor="industry">業界</Label>
        <Select
          value={filters.industry ?? "all"}
          onValueChange={(v) =>
            onFilterChange({
              ...filters,
              industry: v === "all" ? undefined : v,
            })
          }
        >
          <SelectTrigger id="industry">
            <SelectValue placeholder="すべて" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {INDUSTRY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="shiftType">シフト種別</Label>
        <Select
          value={filters.shiftType ?? "all"}
          onValueChange={(v) =>
            onFilterChange({
              ...filters,
              shiftType: v === "all" ? undefined : v,
            })
          }
        >
          <SelectTrigger id="shiftType">
            <SelectValue placeholder="すべて" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {SHIFT_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="salaryMin">最低日給</Label>
        <Input
          id="salaryMin"
          type="number"
          placeholder="例: 10000"
          value={filters.salaryMin ?? ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              salaryMin: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="salaryMax">最高日給</Label>
        <Input
          id="salaryMax"
          type="number"
          placeholder="例: 30000"
          value={filters.salaryMax ?? ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              salaryMax: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="location">勤務地</Label>
        <Input
          id="location"
          placeholder="例: 東京"
          value={filters.location ?? ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              location: e.target.value || undefined,
            })
          }
        />
      </div>
    </div>
  );
}
