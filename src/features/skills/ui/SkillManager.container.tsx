"use client";

import { useState } from "react";
import { useProfile } from "@/features/users/hooks/useProfile";
import {
  useSkillMaster,
  useAddSkill,
  useUpdateSkill,
  useRemoveSkill,
} from "@/features/skills/hooks/useSkills";
import { SkillManagerView } from "@/features/skills/ui/SkillManager.view";
import { toast } from "sonner";

export function SkillManagerContainer() {
  const { data: user, isLoading: userLoading } = useProfile();
  const { data: allSkills, isLoading: skillsLoading } = useSkillMaster();
  const addMutation = useAddSkill();
  const updateMutation = useUpdateSkill();
  const removeMutation = useRemoveSkill();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(1);

  const userSkills = user?.skills ?? [];
  const isLoading = userLoading || skillsLoading;

  const handleAdd = (skillId: string, level: number) => {
    addMutation.mutate(
      { skillId, level },
      {
        onSuccess: () => {
          toast.success("スキルを追加しました");
          setDialogOpen(false);
          setSelectedSkillId("");
          setSelectedLevel(1);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleUpdate = (skillId: string, level: number) => {
    updateMutation.mutate(
      { skillId, level },
      {
        onSuccess: () => {
          toast.success("スキルレベルを更新しました");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleRemove = (skillId: string) => {
    removeMutation.mutate(skillId, {
      onSuccess: () => {
        toast.success("スキルを削除しました");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <SkillManagerView
      userSkills={userSkills}
      allSkills={allSkills ?? []}
      isLoading={isLoading}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      isAdding={addMutation.isPending}
      dialogOpen={dialogOpen}
      onDialogOpenChange={setDialogOpen}
      selectedSkillId={selectedSkillId}
      onSelectedSkillIdChange={setSelectedSkillId}
      selectedLevel={selectedLevel}
      onSelectedLevelChange={setSelectedLevel}
    />
  );
}
