"use client";

import { useQuery } from "@tanstack/react-query";
import { Award, BookOpen, Calendar, Percent } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { StatCard } from "@/components/charts/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () =>
      api<{
        profile: { full_name: string; class_name: string };
        cards: Record<string, number>;
        quiz_results: { title: string; score: number; total: number; subject: string }[];
        announcements: { id: string; title: string; body: string }[];
        notifications: { title: string; body: string; time: string }[];
      }>("/student/dashboard"),
  });

  if (isLoading || !data) return <div className="p-6"><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Hi, {data.profile.full_name}</h1>
          <p className="text-sm text-muted-foreground">{data.profile.class_name} · Your growth hub</p>
        </div>
        <Button variant="outline" onClick={() => toast.success("Report card download started (demo)")}>
          Download Report Card
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="GPA" value={data.cards.gpa} icon={BookOpen} />
        <StatCard label="Attendance" value={`${data.cards.attendance_pct}%`} icon={Percent} />
        <StatCard label="Achievements" value={data.cards.achievements} icon={Award} />
        <StatCard label="Upcoming Exams" value={data.cards.upcoming_exams} icon={Calendar} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Quizzes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.quiz_results.map((q) => (
              <div key={q.title} className="flex justify-between">
                <span>
                  {q.title} · {q.subject}
                </span>
                <span>
                  {q.score}/{q.total}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.notifications.map((n) => (
              <div key={n.title}>
                <p className="font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">
                  {n.body} · {n.time}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
