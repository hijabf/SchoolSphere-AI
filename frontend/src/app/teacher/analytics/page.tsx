"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "@/lib/api";
import { AIChart } from "@/components/charts/ai-chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["teacher-analytics"],
    queryFn: () =>
      api<{ subject_analytics: { topic: string; mastery: number }[] }>("/teacher/dashboard"),
  });

  if (isLoading || !data) return <div className="p-6"><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">Subject Analytics</h1>
      <AIChart title="Topic Mastery" chartType="subject_analytics" chartData={{ series: data.subject_analytics }}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.subject_analytics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="topic" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="mastery" fill="#0d9488" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </AIChart>
    </div>
  );
}
