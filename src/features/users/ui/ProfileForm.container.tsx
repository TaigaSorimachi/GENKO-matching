"use client";

import { useState, useEffect } from "react";
import {
  useProfile,
  useUpdateProfile,
} from "@/features/users/hooks/useProfile";
import { ProfileFormView } from "@/features/users/ui/ProfileForm.view";
import { toast } from "sonner";

type ProfileData = {
  name: string;
  phone: string;
  location: string;
  language: string;
};

export function ProfileFormContainer() {
  const { data: user, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();

  const [formValues, setFormValues] = useState<ProfileData>({
    name: "",
    phone: "",
    location: "",
    language: "ja",
  });

  useEffect(() => {
    if (user) {
      setFormValues({
        name: user.name ?? "",
        phone: user.phone ?? "",
        location: user.location ?? "",
        language: user.language ?? "ja",
      });
    }
  }, [user]);

  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (data: ProfileData) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success("プロフィールを更新しました");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <ProfileFormView
      user={user ?? null}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      isSubmitting={updateMutation.isPending}
      formValues={formValues}
      onFieldChange={handleFieldChange}
    />
  );
}
