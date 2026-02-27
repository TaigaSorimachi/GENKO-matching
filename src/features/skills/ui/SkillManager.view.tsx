"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type SkillItem = {
  id: string;
  name: string;
  category: string;
  industry: string;
};

type UserSkillItem = {
  skillId: string;
  level: number;
  skill: SkillItem;
};

type SkillManagerViewProps = {
  userSkills: UserSkillItem[];
  allSkills: SkillItem[];
  isLoading: boolean;
  onAdd: (skillId: string, level: number) => void;
  onUpdate: (skillId: string, level: number) => void;
  onRemove: (skillId: string) => void;
  isAdding: boolean;
  dialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  selectedSkillId: string;
  onSelectedSkillIdChange: (skillId: string) => void;
  selectedLevel: number;
  onSelectedLevelChange: (level: number) => void;
};

function LevelDisplay({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < level ? "text-yellow-500" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function SkillCardSkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

export function SkillManagerView({
  userSkills,
  allSkills,
  isLoading,
  onAdd,
  onUpdate,
  onRemove,
  isAdding,
  dialogOpen,
  onDialogOpenChange,
  selectedSkillId,
  onSelectedSkillIdChange,
  selectedLevel,
  onSelectedLevelChange,
}: SkillManagerViewProps) {
  const existingSkillIds = new Set(userSkills.map((us) => us.skillId));
  const availableSkills = allSkills.filter((s) => !existingSkillIds.has(s.id));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkillCardSkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">保有スキル</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={onDialogOpenChange}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                スキルを追加
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>スキルを追加</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <Label>スキル</Label>
                  <Select
                    value={selectedSkillId}
                    onValueChange={onSelectedSkillIdChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="スキルを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSkills.map((skill) => (
                        <SelectItem key={skill.id} value={skill.id}>
                          {skill.name}
                          <span className="ml-2 text-xs text-gray-400">
                            {skill.category}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>レベル: {selectedLevel}</Label>
                  <Slider
                    value={[selectedLevel]}
                    onValueChange={([v]) => onSelectedLevelChange(v)}
                    min={1}
                    max={5}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>初心者</span>
                    <span>熟練者</span>
                  </div>
                </div>
                <Button
                  onClick={() => onAdd(selectedSkillId, selectedLevel)}
                  disabled={!selectedSkillId || isAdding}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isAdding ? "追加中..." : "追加する"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {userSkills.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>スキルが登録されていません</p>
              <p className="text-sm mt-1">スキルを追加してマッチング精度を上げましょう</p>
            </div>
          ) : (
            <div className="divide-y">
              {userSkills.map((us) => (
                <div
                  key={us.skillId}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {us.skill.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs">
                        {us.skill.category}
                      </Badge>
                      <LevelDisplay level={us.level} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          onClick={() => onUpdate(us.skillId, level)}
                          className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
                            level === us.level
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <Separator orientation="vertical" className="h-6" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(us.skillId)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs px-2"
                    >
                      削除
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
