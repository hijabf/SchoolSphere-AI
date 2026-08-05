"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentStudyPlanPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["study-plan"],
    queryFn: () =>
      api<{ weekly_plan: { day: string; focus: string; review: string }[]; student: { full_name: string } }>(
        "/ai/study-planner?student_id=stu-0001",
      ),
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">AI Study Planner</h1>
        <p className="text-sm text-muted-foreground">Personalized weekly schedule for {data?.student.full_name ?? "…"}</p>
      </div>
      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data?.weekly_plan.map((d) => (
            <Card key={d.day}>
              <CardHeader>
                <CardTitle className="text-base">{d.day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Focus:</span> {d.focus}
                </p>
                <p>
                  <span className="text-muted-foreground">Review:</span> {d.review}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
