"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useJob, useCreateJob, useUpdateJob } from "@/features/jobs/hooks/useJobManagement";
import { useSkillMaster } from "@/features/skills/hooks/useSkills";
import { useAuthStore } from "@/lib/stores/auth.store";
import { JobFormView } from "./JobForm.view";
import type { ShiftType, JobUrgency } from "@/lib/types/api";

type JobFormContainerProps = {
  mode: "create" | "edit";
  jobId?: string;
};

type FormState = {
  title: string;
  description: string;
  salaryMin: string;
  salaryMax: string;
  location: string;
  shiftType: string;
  urgency: string;
  skills: { skillId: string; skillName: string; minLevel: number }[];
};

const INITIAL_STATE: FormState = {
  title: "",
  description: "",
  salaryMin: "",
  salaryMax: "",
  location: "",
  shiftType: "FULL_TIME",
  urgency: "NORMAL",
  skills: [],
};

export function JobFormContainer({ mode, jobId }: JobFormContainerProps) {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const { data: skillMaster, isLoading: skillsLoading } = useSkillMaster();
  const { data: existingJob, isLoading: jobLoading } = useJob(jobId ?? "");
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();

  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [initialized, setInitialized] = useState(mode === "create");

  useEffect(() => {
    if (mode === "edit" && existingJob && skillMaster && !initialized) {
      setForm({
        title: existingJob.title,
        description: existingJob.description,
        salaryMin: existingJob.salaryMin != null ? String(existingJob.salaryMin) : "",
        salaryMax: existingJob.salaryMax != null ? String(existingJob.salaryMax) : "",
        location: existingJob.location,
        shiftType: existingJob.shiftType,
        urgency: existingJob.urgency ?? "NORMAL",
        skills: existingJob.skills.map((js) => ({
          skillId: js.skillId,
          skillName: js.skill.name,
          minLevel: js.minLevel,
        })),
      });
      setInitialized(true);
    }
  }, [mode, existingJob, skillMaster, initialized]);

  const handleFieldChange = useCallback(
    (field: keyof FormState, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleAddSkill = useCallback(
    (skillId: string) => {
      const skill = skillMaster?.find((s: { id: string; name: string }) => s.id === skillId);
      if (!skill) return;
      setForm((prev) => ({
        ...prev,
        skills: [...prev.skills, { skillId: skill.id, skillName: skill.name, minLevel: 1 }],
      }));
    },
    [skillMaster]
  );

  const handleRemoveSkill = useCallback((skillId: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.skillId !== skillId),
    }));
  }, []);

  const handleSkillLevelChange = useCallback((skillId: string, level: number) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.map((s) =>
        s.skillId === skillId ? { ...s, minLevel: level } : s
      ),
    }));
  }, []);

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast.error("タイトルを入力してください");
      return;
    }
    if (!form.description.trim()) {
      toast.error("仕事内容を入力してください");
      return;
    }
    if (!form.location.trim()) {
      toast.error("勤務地を入力してください");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      location: form.location.trim(),
      shiftType: form.shiftType as ShiftType,
      urgency: form.urgency as JobUrgency,
      skills: form.skills.map((s) => ({ skillId: s.skillId, minLevel: s.minLevel })),
    };

    if (mode === "create") {
      createJob.mutate(
        { ...payload, companyId: currentUser!.companyId! },
        {
          onSuccess: () => {
            toast.success("求人を作成しました");
            router.push("/company/jobs");
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      updateJob.mutate(
        { id: jobId!, data: payload },
        {
          onSuccess: () => {
            toast.success("求人を更新しました");
            router.push("/company/jobs");
          },
          onError: (err) => toast.error(err.message),
        }
      );
    }
  };

  const handleCancel = () => {
    router.push("/company/jobs");
  };

  const isSubmitting = createJob.isPending || updateJob.isPending;

  return (
    <JobFormView
      defaultValues={form}
      skills={skillMaster ?? []}
      isSubmitting={isSubmitting}
      mode={mode}
      onFieldChange={handleFieldChange}
      onAddSkill={handleAddSkill}
      onRemoveSkill={handleRemoveSkill}
      onSkillLevelChange={handleSkillLevelChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
