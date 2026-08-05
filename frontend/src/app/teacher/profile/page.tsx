"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["teacher-profile"],
    queryFn: () =>
      api<{
        profile: {
          full_name: string;
          specialization: string;
          employee_code: string;
          qualification: string;
          performance_score: number;
          classes: string[];
        };
      }>("/teacher/dashboard"),
  });

  if (isLoading || !data) return <div className="p-6"><Skeleton className="h-40" /></div>;
  const p = data.profile;

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">Teacher Profile</h1>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="font-display text-xl">{p.full_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Code:</span> {p.employee_code}
          </p>
          <p>
            <span className="text-muted-foreground">Specialization:</span> {p.specialization}
          </p>
          <p>
            <span className="text-muted-foreground">Qualification:</span> {p.qualification}
          </p>
          <p>
            <span className="text-muted-foreground">Performance:</span> {p.performance_score}
          </p>
          <p>
            <span className="text-muted-foreground">Classes:</span> {p.classes.join(", ")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
