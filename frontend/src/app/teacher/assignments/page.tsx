"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherAssignmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["teacher-assignments"],
    queryFn: () =>
      api<{ assignments: { title: string; due: string; submitted: number; total: number }[] }>(
        "/teacher/dashboard",
      ),
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">Assignments</h1>
      {isLoading ? (
        <Skeleton className="h-40" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.assignments.map((a) => (
            <Card key={a.title}>
              <CardHeader>
                <CardTitle className="text-base">{a.title}</CardTitle>
                <p className="text-xs text-muted-foreground">Due {a.due}</p>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm">
                  Submitted {a.submitted}/{a.total}
                </p>
                <Progress value={(a.submitted / a.total) * 100} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
