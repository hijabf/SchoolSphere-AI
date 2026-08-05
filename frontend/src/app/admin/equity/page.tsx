"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function EquityPage() {
  const equity = useQuery({
    queryKey: ["equity"],
    queryFn: () =>
      api<{
        attendance: { boys: number; girls: number };
        gpa: { boys: number; girls: number };
        enrollment: { boys: number; girls: number };
        insight: string;
      }>("/ai/equity"),
  });
  const sdg = useQuery({
    queryKey: ["sdg"],
    queryFn: () =>
      api<{ indicators: { goal: string; progress: number }[]; insight: string }>("/ai/sdg"),
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">Education Equity & SDG</h1>

      {equity.isLoading ? (
        <Skeleton className="h-40" />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {(
            [
              ["Attendance %", equity.data!.attendance],
              ["GPA", equity.data!.gpa],
              ["Enrollment", equity.data!.enrollment],
            ] as const
          ).map(([label, vals]) => (
            <Card key={label}>
              <CardHeader>
                <CardTitle className="text-base">{label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Boys</span>
                  <span className="font-medium">{vals.boys}</span>
                </div>
                <div className="flex justify-between">
                  <span>Girls</span>
                  <span className="font-medium">{vals.girls}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">{equity.data?.insight}</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SDG Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sdg.data?.indicators.map((i) => (
            <div key={i.goal}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{i.goal}</span>
                <span>{i.progress}%</span>
              </div>
              <Progress value={i.progress} />
            </div>
          ))}
          <p className="pt-2 text-sm text-muted-foreground">{sdg.data?.insight}</p>
        </CardContent>
      </Card>
    </div>
  );
}
