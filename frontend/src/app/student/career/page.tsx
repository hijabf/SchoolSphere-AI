"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentCareerPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["career"],
    queryFn: () =>
      api<{ recommended_paths: string[]; note: string; student: { full_name: string; interests: string[] } }>(
        "/ai/career-guidance?student_id=stu-0001",
      ),
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">AI Career Guidance</h1>
      {isLoading ? (
        <Skeleton className="h-40" />
      ) : (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-base">Paths for {data?.student.full_name}</CardTitle>
            <p className="text-xs text-muted-foreground">
              Interests: {data?.student.interests?.join(", ")}
            </p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data?.recommended_paths.map((p) => (
              <p key={p} className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                {p}
              </p>
            ))}
            <p className="text-muted-foreground">{data?.note}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
