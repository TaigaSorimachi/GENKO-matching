"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type KpiCardViewProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  isLoading?: boolean;
};

export function KpiCardView({ title, value, subtitle, isLoading }: KpiCardViewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="mb-1 h-8 w-16" />
          {subtitle && <Skeleton className="h-3 w-32" />}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
