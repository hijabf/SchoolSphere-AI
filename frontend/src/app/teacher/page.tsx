"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, ClipboardList, Users, Percent } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "@/lib/api";
import { StatCard } from "@/components/charts/stat-card";
import { AIChart } from "@/components/charts/ai-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["teacher-dashboard"],
    queryFn: () =>
      api<{
        profile: { full_name: string; specialization: string };
        todays_classes: { time: string; class: string; subject: string; room: string }[];
        cards: Record<string, number>;
        performance_trend: { month: string; avg: number }[];
        class_analytics: { avg_gpa: number; attendance: number; at_risk: number };
        assignments: { title: string; due: string; submitted: number; total: number }[];
      }>("/teacher/dashboard"),
  });

  if (isLoading || !data) {
    return (
      <div className="p-6">
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Welcome, {data.profile.full_name}</h1>
        <p className="text-sm text-muted-foreground">{data.profile.specialization} · Today&apos;s plan</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My Students" value={data.cards.my_students} icon={Users} />
        <StatCard label="Classes Today" value={data.cards.classes_today} icon={BookOpen} />
        <StatCard label="Pending Marking" value={data.cards.pending_marking} icon={ClipboardList} />
        <StatCard label="Class Attendance" value={`${data.cards.avg_class_attendance}%`} icon={Percent} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today&apos;s Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.todays_classes.map((c) => (
              <div key={c.time + c.class} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">
                    {c.class} · {c.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">{c.room}</p>
                </div>
                <span className="text-muted-foreground">{c.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <AIChart title="Class Performance Trend" chartType="performance_trend" chartData={{ series: data.performance_trend }}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.performance_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avg" stroke="#0d9488" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </AIChart>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.assignments.map((a) => (
            <div key={a.title} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">Due {a.due}</p>
              </div>
              <span>
                {a.submitted}/{a.total}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
