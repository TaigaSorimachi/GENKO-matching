"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ProfileData = {
  name: string;
  phone: string;
  location: string;
  language: string;
};

type ProfileFormViewProps = {
  user: ProfileData | null;
  isLoading: boolean;
  onSubmit: (data: ProfileData) => void;
  isSubmitting: boolean;
  formValues: ProfileData;
  onFieldChange: (field: keyof ProfileData, value: string) => void;
};

function ProfileFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="h-10 w-full mt-4" />
      </CardContent>
    </Card>
  );
}

export function ProfileFormView({
  user,
  isLoading,
  onSubmit,
  isSubmitting,
  formValues,
  onFieldChange,
}: ProfileFormViewProps) {
  if (isLoading) {
    return <ProfileFormSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <p className="text-lg">プロフィールが見つかりませんでした</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">プロフィール編集</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formValues);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={formValues.name}
              onChange={(e) => onFieldChange("name", e.target.value)}
              placeholder="名前を入力"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">電話番号</Label>
            <Input
              id="phone"
              type="tel"
              value={formValues.phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              placeholder="090-1234-5678"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">所在地</Label>
            <Input
              id="location"
              value={formValues.location}
              onChange={(e) => onFieldChange("location", e.target.value)}
              placeholder="例: 東京都新宿区"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="language">言語</Label>
            <Input
              id="language"
              value={formValues.language}
              onChange={(e) => onFieldChange("language", e.target.value)}
              placeholder="例: ja"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "保存中..." : "プロフィールを保存"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
