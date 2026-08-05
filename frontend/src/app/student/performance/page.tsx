"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/lib/api";
import { AIChart } from "@/components/charts/ai-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentPerformancePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-performance"],
    queryFn: () =>
      api<{
        subject_performance: { subject: string; score: number }[];
        performance_trend: { month: string; gpa: number }[];
        exam_results: { title: string; score: number; total: number; grade: string }[];
      }>("/student/dashboard"),
  });
  const [analysis, setAnalysis] = useState("");

  async function analyze() {
    try {
      const res = await api<{ analysis: string; strengths: string[]; weaknesses: string[] }>(
        "/ai/performance-analyzer?student_id=stu-0001",
      );
      setAnalysis(
        `${res.analysis}\n\nStrengths: ${res.strengths.join(", ")}\nWeaknesses: ${res.weaknesses.join(", ")}`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  if (isLoading || !data) return <div className="p-6"><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold">Performance</h1>
        <Button onClick={analyze}>AI Analyzer</Button>
      </div>
      {analysis && (
        <Card>
          <CardContent className="whitespace-pre-wrap p-4 text-sm">{analysis}</CardContent>
        </Card>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <AIChart title="Subjects" chartType="subject_performance" chartData={{ series: data.subject_performance }}>
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
        <AIChart title="GPA Trend" chartType="performance_trend" chartData={{ series: data.performance_trend }}>
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
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exam Results</CardTitle>
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
  );
}
