"use client";

import { useQuery } from "@tanstack/react-query";
import { Award, BookOpen, Calendar, Percent } from "lucide-react";
import { toast } from "sonner";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/lib/api";
import { StatCard } from "@/components/charts/stat-card";
import { AIChart } from "@/components/charts/ai-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParentDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["parent-dashboard"],
    queryFn: () =>
      api<{
        selected_child: { full_name: string; class_name: string; gpa: number; attendance_pct: number };
        children: { id: string; full_name: string }[];
        cards: Record<string, number>;
        performance_trend: { month: string; gpa: number }[];
        upcoming_exams: { title: string; date: string; subject: string }[];
        teacher_remarks: { teacher: string; subject: string; remark: string }[];
      }>("/parent/dashboard"),
  });

  if (isLoading || !data) return <div className="p-6"><Skeleton className="h-64" /></div>;
  const child = data.selected_child;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">{child.full_name}</h1>
          <p className="text-sm text-muted-foreground">{child.class_name} · Parent overview</p>
        </div>
        <Button variant="outline" onClick={() => toast.success("Report card PDF queued (demo)")}>
          Download Report Card
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="GPA" value={child.gpa} icon={BookOpen} />
        <StatCard label="Attendance" value={`${child.attendance_pct}%`} icon={Percent} />
        <StatCard label="Achievements" value={data.cards.achievements} icon={Award} />
        <StatCard label="Upcoming Exams" value={data.cards.upcoming_exams} icon={Calendar} />
      </div>

      <AIChart title="Performance Trend" chartType="performance_trend" chartData={{ series: data.performance_trend }}>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data.performance_trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 4]} />
            <Tooltip />
            <Line type="monotone" dataKey="gpa" stroke="#0d9488" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </AIChart>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.upcoming_exams.map((e) => (
              <div key={e.title} className="flex justify-between">
                <span>{e.title}</span>
                <span className="text-muted-foreground">{e.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Teacher Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.teacher_remarks.map((r) => (
              <div key={r.teacher + r.subject}>
                <p className="font-medium">
                  {r.teacher} · {r.subject}
                </p>
                <p className="text-muted-foreground">{r.remark}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
