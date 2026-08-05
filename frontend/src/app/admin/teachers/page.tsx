"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

type Teacher = {
  id: string;
  full_name: string;
  specialization: string;
  performance_score: number;
  qualification: string;
  classes: string[];
};

export default function AdminTeachersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-teachers"],
    queryFn: () => api<{ items: Teacher[] }>("/admin/teachers"),
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Teachers</h1>
        <p className="text-sm text-muted-foreground">Faculty performance overview</p>
      </div>
      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.items.map((t) => (
            <div key={t.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{t.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.specialization} · {t.qualification}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.classes.join(", ")}</p>
                </div>
                <span className="font-display text-xl font-semibold text-primary">{t.performance_score}</span>
              </div>
              <Progress value={t.performance_score} className="mt-4" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
