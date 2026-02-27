"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import type { Skill } from "@/lib/types/api";

const SHIFT_TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "フルタイム" },
  { value: "PART_TIME", label: "パート" },
  { value: "SPOT", label: "スポット" },
  { value: "CONTRACT", label: "契約" },
];

const URGENCY_OPTIONS = [
  { value: "NORMAL", label: "通常" },
  { value: "URGENT", label: "急募" },
  { value: "EMERGENCY", label: "緊急" },
];

type SelectedSkill = {
  skillId: string;
  skillName: string;
  minLevel: number;
};

type JobFormValues = {
  title: string;
  description: string;
  salaryMin: string;
  salaryMax: string;
  location: string;
  shiftType: string;
  urgency: string;
  skills: SelectedSkill[];
};

type JobFormViewProps = {
  defaultValues: JobFormValues;
  skills: Skill[];
  isSubmitting: boolean;
  mode: "create" | "edit";
  onFieldChange: (field: keyof JobFormValues, value: string) => void;
  onAddSkill: (skillId: string) => void;
  onRemoveSkill: (skillId: string) => void;
  onSkillLevelChange: (skillId: string, level: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function JobFormView({
  defaultValues,
  skills,
  isSubmitting,
  mode,
  onFieldChange,
  onAddSkill,
  onRemoveSkill,
  onSkillLevelChange,
  onSubmit,
  onCancel,
}: JobFormViewProps) {
  const availableSkills = skills.filter(
    (s) => !defaultValues.skills.some((sel) => sel.skillId === s.id)
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {mode === "create" ? "新規求人作成" : "求人編集"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              placeholder="例: 建築現場の足場組立作業員"
              value={defaultValues.title}
              onChange={(e) => onFieldChange("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">仕事内容</Label>
            <Textarea
              id="description"
              placeholder="仕事内容を詳しく記載してください"
              rows={5}
              value={defaultValues.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">最低給与（円）</Label>
              <Input
                id="salaryMin"
                type="number"
                placeholder="例: 10000"
                value={defaultValues.salaryMin}
                onChange={(e) => onFieldChange("salaryMin", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryMax">最高給与（円）</Label>
              <Input
                id="salaryMax"
                type="number"
                placeholder="例: 15000"
                value={defaultValues.salaryMax}
                onChange={(e) => onFieldChange("salaryMax", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">勤務地</Label>
            <Input
              id="location"
              placeholder="例: 東京都新宿区"
              value={defaultValues.location}
              onChange={(e) => onFieldChange("location", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>勤務形態</Label>
              <Select
                value={defaultValues.shiftType}
                onValueChange={(val) => onFieldChange("shiftType", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {SHIFT_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>緊急度</Label>
              <Select
                value={defaultValues.urgency}
                onValueChange={(val) => onFieldChange("urgency", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {URGENCY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>必要スキル</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {defaultValues.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {defaultValues.skills.map((skill) => (
                <div
                  key={skill.skillId}
                  className="flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2"
                >
                  <span className="text-sm font-medium">{skill.skillName}</span>
                  <Select
                    value={String(skill.minLevel)}
                    onValueChange={(val) => onSkillLevelChange(skill.skillId, Number(val))}
                  >
                    <SelectTrigger className="h-7 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((lv) => (
                        <SelectItem key={lv} value={String(lv)}>
                          Lv.{lv}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => onRemoveSkill(skill.skillId)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {availableSkills.length > 0 && (
            <div className="space-y-2">
              <Label>スキルを追加</Label>
              <Select onValueChange={onAddSkill}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="スキルを選択" />
                </SelectTrigger>
                <SelectContent>
                  {availableSkills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          キャンセル
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting
            ? "保存中..."
            : mode === "create"
              ? "求人を作成"
              : "変更を保存"}
        </Button>
      </div>
    </div>
  );
}
