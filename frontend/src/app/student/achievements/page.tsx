"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentAchievementsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-achievements"],
    queryFn: () =>
      api<{
        achievements: { title: string; category: string; awarded_at: string }[];
        behavior: { category: string; title: string; date: string }[];
      }>("/student/dashboard"),
  });

  if (isLoading || !data) return <div className="p-6"><Skeleton className="h-40" /></div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">Achievements & Behavior</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {data.achievements.map((a) => (
          <Card key={a.title}>
            <CardHeader>
              <CardTitle className="text-base">{a.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm">
              <Badge variant="secondary">{a.category}</Badge>
              <span className="text-muted-foreground">{a.awarded_at}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Behavior Record</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {data.behavior.map((b) => (
            <div key={b.title} className="flex justify-between">
              <span>
                {b.title}{" "}
                <Badge variant={b.category === "positive" ? "success" : "secondary"}>{b.category}</Badge>
              </span>
              <span className="text-muted-foreground">{b.date}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
