"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "@/lib/api";
import { AIChart } from "@/components/charts/ai-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParentGradesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["parent-grades"],
    queryFn: () =>
      api<{
        quiz_results: { title: string; subject: string; score: number; total: number; date: string }[];
        exam_results: { title: string; score: number; total: number; grade: string; date: string }[];
        subject_performance: { subject: string; score: number }[];
      }>("/parent/dashboard"),
  });

  if (isLoading || !data) return <div className="p-6"><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">Grades</h1>
      <AIChart title="Subject Performance" chartType="subject_performance" chartData={{ series: data.subject_performance }}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data.subject_performance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="score" fill="#0d9488" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </AIChart>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quizzes</CardTitle>
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
            <CardTitle className="text-base">Exams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.exam_results.map((e) => (
              <div key={e.title} className="flex justify-between">
                <span>{e.title}</span>
                <span>
                  {e.score}/{e.total} ({e.grade})
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
