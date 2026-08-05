"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "@/lib/api";
import { AIChart } from "@/components/charts/ai-chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard-analytics"],
    queryFn: () =>
      api<{
        charts: {
          class_performance: { class: string; avg_gpa: number; attendance: number }[];
          teacher_performance: { name: string; score: number }[];
          enrollment_trend: { month: string; students: number }[];
        };
      }>("/admin/dashboard"),
  });

  if (isLoading || !data) return <div className="p-6"><Skeleton className="h-96" /></div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">Analytics</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <AIChart title="Class Performance" chartType="class_performance" chartData={{ series: data.charts.class_performance }}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.charts.class_performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg_gpa" fill="#0d9488" name="GPA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AIChart>
        <AIChart title="Teacher Performance" chartType="teacher_performance" chartData={{ series: data.charts.teacher_performance }}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.charts.teacher_performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#0f766e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AIChart>
      </div>
    </div>
  );
}
