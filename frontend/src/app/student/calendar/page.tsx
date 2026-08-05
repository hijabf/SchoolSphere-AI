"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentCalendarPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-calendar"],
    queryFn: () =>
      api<{
        upcoming_exams: { title: string; date: string; subject: string }[];
        announcements: { title: string; published_at: string; body: string }[];
      }>("/student/dashboard"),
  });

  if (isLoading || !data) return <div className="p-6"><Skeleton className="h-40" /></div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">School Calendar</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.upcoming_exams.map((e) => (
              <div key={e.title} className="flex justify-between border-b border-border pb-2">
                <div>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.subject}</p>
                </div>
                <span>{e.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.announcements.map((a) => (
              <div key={a.title}>
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.published_at}</p>
                <p className="text-muted-foreground">{a.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
